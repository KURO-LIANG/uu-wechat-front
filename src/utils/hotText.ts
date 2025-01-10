const hotText = [
    "说点什么吧，万一🔥了呢 ~",
    "走过路过，千万不要错过😙",
    "别怕踩，我不怕疼🤘",
    "就决定是你啦!"
]

const getRandomHotText = () => {
    return hotText[Math.floor(Math.random() * hotText.length)]
}
export default getRandomHotText
