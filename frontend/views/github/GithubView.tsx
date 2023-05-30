import React, { useEffect } from 'react';
import './github.css';
import {BsGithub} from "react-icons/all";

const DVDPlayer: React.FC = () => {
    useEffect(() => {
        const dvdElements = Array.from(document.getElementsByClassName(
            'dvdLogo'
        )) as HTMLElement[];

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const dvdWidth = dvdElements[0].clientWidth;
        const dvdHeight = dvdElements[0].clientHeight;
        let maxPosX = (screenWidth - dvdWidth) * 0.5; // Riduci il range orizzontale al 60% dello schermo
        let maxPosY = (screenHeight - dvdHeight) * 0.7; // Aumenta il range verticale al 90% dello schermo

        const dvdsData = dvdElements.map((dvdElement) => {
            const positionX = Math.random() * maxPosX;
            const positionY = Math.random() * maxPosY;
            const directionX = 1;
            const directionY = 1;

            return {
                element: dvdElement,
                positionX,
                positionY,
                directionX,
                directionY,
            };
        });

        const animateDVDs = () => {
            requestAnimationFrame(animateDVDs);

            dvdsData.forEach((dvdData) => {
                const { element, positionX, positionY, directionX, directionY } =
                    dvdData;

                let newX = positionX + directionX;
                let newY = positionY + directionY;

                if (newX <= 0) {
                    newX = 0;
                    dvdData.directionX *= -1;
                } else if (newX >= maxPosX) {
                    newX = maxPosX;
                    dvdData.directionX *= -1;
                }

                if (newY <= 0) {
                    newY = 0;
                    dvdData.directionY *= -1;
                } else if (newY >= maxPosY) {
                    newY = maxPosY;
                    dvdData.directionY *= -1;
                }

                element.style.transform = `translate(${newX}px, ${newY}px)`;

                dvdData.positionX = newX;
                dvdData.positionY = newY;
            });
        };

        animateDVDs();
    }, []);

    const dvdImages = Array.from({ length: 13 }).map((_, index) => (
        <img
            key={index}
            className="dvdLogo"
            src={`../../img/bounce/${index}.svg`}
            alt={`DVD ${index}`}
        />
    ));

    const redirectToGitHub = () => {
        window.location.href = "https://github.com/PROSLab/BPMN-Inspector";
    };

    return <div className="dvd-container">
        <button
            className="centered-button"
            onClick={redirectToGitHub}
            style={{ backgroundColor: "#444444", position:"fixed", padding: '10px 20px',borderRadius: '15px', cursor: 'pointer',marginLeft:"30%", marginTop:"20%", zIndex:"9" }}
        >
            <BsGithub style={{ marginBottom: "3px", marginRight: "5px", height:"60px", width:"60px" }} /> GitHub Source Code
        </button>
        {dvdImages}</div>;
};

export default DVDPlayer;