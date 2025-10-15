export default {
    base: "./",
    css: {
        devSourcemap: true,
    },
    appType: "custom",
    server: {
        // Expose the server to the network allowing access from ip address
        host: true,
        hmr: true,
        middlewareMode: true,
    },
};
