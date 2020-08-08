const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const {
	CleanWebpackPlugin
} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssatsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
console.log("NODE_ENV", process.env.NODE_ENV);
console.log("IS DEV", isDev);

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const optimization = () => {
	const config = {};

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssatsWebpackPlugin(),
			new TerserWebpackPlugin(),
		];
	}

	return config;
};

module.exports = {
	context: path.resolve(__dirname, "src"),
	mode: "development",
	entry: {
		main: ["./index.js"],
	},
	output: {
		filename: filename("js"),
		path: path.resolve(__dirname, "dist"),
	},
	devServer: {
		port: 8081,
		overlay: true,
		contentBase: path.join(__dirname, "/dist"),
	},
	optimization: optimization(),
	plugins: [
		new HTMLWebpackPlugin({
			template: "./index.html",
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: filename("css"),
		}),
		new CopyWebpackPlugin({
			patterns: [
				// {
				// 	from: path.resolve(__dirname, "src/favicon.ico"),
				// 	to: path.resolve(__dirname, "dist"),
				// },
				{
					from: path.resolve(__dirname, "src/img"),
					to: path.resolve(__dirname, "dist/img")
				},
				{
					from: path.resolve(__dirname, "src/fonts"),
					to: path.resolve(__dirname, "dist/fonts")
				},
			],
		}),
	],
	module: {
		rules: [{
				test: /\.css$/,
				use: [{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isDev,
							reloadAll: true,
						},
					},
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							config: {
								path: "src/postcss.config.js",
							},
						},
					},
				],
			},
			{
				test: /\.s[ac]ss$/,
				use: [{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isDev,
							reloadAll: true,
						},
					},
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							config: {
								path: "src/postcss.config.js",
							},
						},
					},
					"sass-loader",
				],
			},

			// {
			//   test: /\.(png|jpg|svg|gif)$/,
			//   use: [{
			//     loader: "file-loader",
			//     options: {
			//       name: "[path][name].[ext]",
			//     },
			//   }, ],
			// },
			// {
			// 	test: /\.(ttf|woff|woff2|eot)$/,
			// 	use: ["file-loader"],
			// },
		],
	},
};