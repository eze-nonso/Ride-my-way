module.exports = {
    extends: "airbnb-base",
    rules: {
        "linebreak-style":[
            "error", "windows"
        ],
        "import/no-amd": "off"
    },
    env: {
        "node": true,
        es6: true
    },
    root: true
};