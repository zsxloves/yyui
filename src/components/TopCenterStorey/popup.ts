
const yuanPopup= (json:any) => {
    return (
       `<div>${
        json.features[0].properties.data.name
       }</div>`
    )
}

export default yuanPopup


