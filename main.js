let tabOne = null
let windowOne = null
// let websessionOne = null
let webviewOne = null

console.log('Hello World')

ext.runtime.onEnable.addListener(() => {
    console.log('Extension Enabled')
})

ext.runtime.onExtensionClick.addListener(async() => {
    console.log('Extention Clicked')

    if (!tabOne) {
        tabOne = await ext.tabs.create({
            text: 'Practice Tab',
            mutable: true,
            muted: false
        })

        windowOne = await ext.windows.create()

        // websessionOne = await ext.websessions.create({ 
		// 	partition: 'Practice Extension',
		// 	persistent: true,
		// 	global: false,
		// 	cache: true
		// });

        // await ext.websessions.loadExtension(websessionOne.id, 'hpnelpabemhjfjgiibgkliipaehnfcjk', true)

        const windowOneSize = await ext.windows.getSize(windowOne.id)

        webviewOne = await ext.webviews.create({
            window: windowOne,
            // websession: websessionOne,
            bounds: { x: 0, y:25, width: windowOneSize.width, height: windowOneSize.height - 25},
            autoResize: { width: true, height: true}
        })

        await ext.webviews.loadURL(webviewOne.id, 'https://www.youtube.com')
        // await ext.webviews.executeJavascript(webviewOne.id, `var elems = document.querySelectorAll('[is-shorts]'); for (var i = 0; i < elems.length; i++) {elems[i].style.display = 'none';}`)
        // await ext.webviews.executeJavascript(webviewOne.id, `var elems = document.querySelectorAll('[title="Shorts"]'); for (var i = 0; i < elems.length; i++) {elems[i].style.display = 'none';}`)
        // await ext.webviews.openDevTools(webviewOne.id, { mode: 'undocked' })
    }
})

ext.tabs.onClickedMute.addListener(async(_event, tab) => {
    await ext.tabs.update(tabOne.id, { muted: !tab.muted })
    if (webviewOne && webviewOne.id) {
        await ext.webviews.setAudioMuted(webviewOne.id, !tab.muted)
    }
})

ext.tabs.onClicked.addListener(async () => {
    if (windowOne && windowOne.id) {
        await ext.windows.restore(windowOne.id)
        await ext.windows.focus(windowOne.id)
    }
})

ext.tabs.onClickedClose.addListener(async() => {
    if (tabOne && tabOne.id) {
        await ext.tabs.remove(tabOne.id)
        tabOne = null
    }
    if (windowOne && windowOne.id) {
        await ext.windows.remove(windowOne.id)
        windowOne = null
    }
})

ext.windows.onClosed.addListener(async () => {
    if (tabOne && tabOne.id) {
        await ext.tabs.remove(tabOne.id)
        tabOne = null
    }
})

ext.webviews.onPageTitleUpdated.addListener(async (_event, details) => {
    if (windowOne && windowOne.id) {
        await ext.windows.setTtile(windowOne.id, details.title)
    }
    if(tabOne && tabOne.id) {
        await ext.tabs.update(tabOne.id, { text: details.title })
    }
})