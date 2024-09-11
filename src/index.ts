import {MyApp} from "./app";

window.addEventListener("load", () => {
    MyApp.Initialize();
    MyApp.Start();
});

window.addEventListener("resize", () => {
    MyApp.Resize(window.innerWidth, window.innerHeight);
});
