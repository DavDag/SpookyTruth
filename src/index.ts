import { MyApp } from './app'

window.addEventListener('load', () => {
    MyApp.Initialize()
    MyApp.Start()
})

// window.addEventListener('resize', () => {
//     MyApp.Resize(window.innerWidth, window.innerHeight)
// })

const obs = new MutationObserver(() => {
    const btn = document.getElementById('excalibur-play')
    document.getElementById('custom-start-overlay-play-btn').style.display =
        !!btn ? 'grid' : 'none'
})

obs.observe(document.body, { childList: true })
document.getElementById('custom-start-overlay-play-btn').onclick = () => {
    document.getElementById('excalibur-play').click()
    document.getElementById('custom-start-overlay').style.display = 'none'
}
