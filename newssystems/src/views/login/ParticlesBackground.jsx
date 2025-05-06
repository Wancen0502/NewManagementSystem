import Particles from "react-particles";
import { useCallback } from "react";
import { loadSlim } from "tsparticles-slim";

function ParticlesBackground(){

    const particlesInit = useCallback(async engine => {
        console.log(engine);
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                    color: {
                        value: "rgba(35,39,65)",
                    },
                },
                fpsLimit: 300,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: 'repulse',
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.7,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#FFDC7F",
                    },
                    links: {
                        color: "#D4EBF8",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 3,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.7,
                    },
                    shape: {
                        type: "star",
                    },
                    size: {
                        value: { min: 3, max: 7 },
                    },
                },
                detectRetina: true,
            }}
        />
    );

}

export default ParticlesBackground