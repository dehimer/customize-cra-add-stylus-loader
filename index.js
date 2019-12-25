const addStylusLoader = (loaderOptions = {}) => config => {
  const mode = process.env.NODE_ENV === "development" ? "dev" : "prod";

  // Need these for production mode, which are copied from react-scripts
  const publicPath = require("react-scripts/config/paths").servedPath;
  const shouldUseRelativeAssetPaths = publicPath === "./";
  const shouldUseSourceMap =
    mode === "prod" && process.env.GENERATE_SOURCEMAP !== "false";
  const stylRegex = /\.styl$/;
  const stylModuleRegex = /\.module\.styl$/;
  const localIdentName =
    loaderOptions.localIdentName || "[path][name]__[local]--[hash:base64:5]";

  const getStylusLoader = cssOptions => {
    return [
      mode === "dev"
        ? require.resolve("style-loader")
        : {
          loader: require("mini-css-extract-plugin").loader,
          options: Object.assign(
            {},
            shouldUseRelativeAssetPaths ? { publicPath: "../../" } : undefined
          )
        },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009"
              },
              stage: 3
            })
          ],
          sourceMap: shouldUseSourceMap
        }
      },
      {
        loader: require.resolve("stylus-loader"),
        options: Object.assign(loaderOptions, {
          source: shouldUseSourceMap
        })
      }
    ];
  };

  const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;

  // Insert stylus-loader as the penultimate item of loaders (before file-loader)
  loaders.splice(
    loaders.length - 1,
    0,
    {
      test: stylRegex,
      exclude: stylModuleRegex,
      use: getStylusLoader({
        importLoaders: 2
      }),
      sideEffects: mode === "prod"
    },
    {
      test: stylModuleRegex,
      use: getStylusLoader({
        importLoaders: 2,
        modules: {
          localIdentName: localIdentName
        },
      })
    }
  );

  return config;
};




module.exports = addStylusLoader;
