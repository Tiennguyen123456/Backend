// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const sideBarConfig = {
    width: "300px",
    images: {
        logo: require("@/assets/images/Delfi_Logo.png"),
        width: 150,
        height: 100,
    },
    colors: {
        bg: "#282E28",
        activeColor: "#FFDB00",
        hoverBg: "#3D423D",
        activeBg: "#3D423D",
    },
    mainBg: hexToRgba("#282E28", 1),
    root: {
        fontSize: "16px",
        fontWeight: 400,
        color: "#FFF",
    },
    icon: {
        color: "#fff",
        disabled: "#30ab6d",
    },
    SubMenuExpandIcon: {
        color: "#b6b7b9",
    },
    subMenuContent: {
        backgroundColor: hexToRgba("#282E28", 1),
    },
    button: {
        disabled: "#30ab6d",
        hover: {
            backgroundColor: hexToRgba("#3D423D", 1),
            color: "#FFDB00",
        },
    },
    group: {
        color: "text-white",
    },
};

export default sideBarConfig;
