import React, { useEffect, useRef } from "react";
//import { useSpring, animated } from "react-spring";
import "./github.css";
import { BsGithub } from "react-icons/all";

export default function GithubView() {
    const redirectToGitHub = () => {
        window.location.href = "https://github.com/PROSLab/BPMN-Inspector";
    };

    const floatingIconsRef = useRef<(HTMLImageElement | null)[]>([]);

    useEffect(() => {
        const floatingIcons = floatingIconsRef.current;
        floatingIcons.forEach((icon) => {
            const randomDelay = Math.random() * 2; // Ritardo casuale tra 0 e 2 secondi
            const randomTranslateX = Math.floor(Math.random() * 100) + 1;
            const randomTranslateY = Math.floor(Math.random() * 100) + 1;

            if (icon) {
                // Anima la posizione dell'icona
                const animation = useSpring({
                    from: { transform: `translate(0px, 0px)` },
                    to: {
                        transform: `translate(${randomTranslateX}px, ${randomTranslateY}px)`,
                    },
                    config: { duration: 2000, delay: randomDelay * 1000, reset: true },
                    loop: true,
                });

                // Applica l'animazione all'icona
                animated(icon as HTMLImageElement, animation);
            }
        });
    }, []);

    return (
        <div className="flex flex-col h-full items-left justify-left p-l text-left box-border">
            <div className="svg-container">
                <animated.img
                    style={{ width: "50px", height: "50px" }}
                    src="../../img/data.svg"
                    alt="Immagine 1"
                    className="floating-svg"
                    ref={(el: HTMLImageElement) => (floatingIconsRef.current[0] = el as HTMLImageElement)}
                />
                <animated.img
                    style={{ width: "50px", height: "50px" }}
                    src="../../img/dataStore.svg"
                    alt="Immagine 2"
                    className="floating-svg"
                    ref={(el: HTMLImageElement) => (floatingIconsRef.current[1] = el as HTMLImageElement)}
                />
                <animated.img
                    style={{ width: "50px", height: "50px" }}
                    src="../../img/end.svg"
                    alt="Immagine 3"
                    className="floating-svg"
                    ref={(el: HTMLImageElement) => (floatingIconsRef.current[2] = el as HTMLImageElement)}
                />
                {/* Aggiungi altre immagini fluttuanti qui */}
            </div>
            <button
                className="centered-button"
                onClick={redirectToGitHub}
                style={{ backgroundColor: "#444444" }}
            >
                <BsGithub style={{ marginBottom: "3px", marginRight: "5px" }} /> GitHub source code
            </button>
        </div>
    );
}
