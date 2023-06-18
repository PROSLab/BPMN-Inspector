import React, { useEffect } from 'react';
import './github.css';
import developer from "../../img/develop.gif"
import {BsGithub} from "react-icons/all";
import img0 from '../../img/bounce/0.svg';
import img1 from '../../img/bounce/1.svg';
import img2 from '../../img/bounce/2.svg';
import img3 from '../../img/bounce/3.svg';
import img4 from '../../img/bounce/4.svg';
import img5 from '../../img/bounce/5.svg';
import img6 from '../../img/bounce/6.svg';
import img7 from '../../img/bounce/7.svg';
import img8 from '../../img/bounce/8.svg';
import img9 from '../../img/bounce/9.svg';
import img10 from '../../img/bounce/10.svg';
import img11 from '../../img/bounce/11.svg';
import img12 from '../../img/bounce/12.svg';

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

    const dvdImages = [
        img0,
        img1,
        img2,
        img3,
        img4,
        img5,
        img6,
        img7,
        img8,
        img9,
        img10,
        img11,
        img12
    ].map((src, index) => (
        <img
            key={index}
            className="dvdLogo"
            src={src}
        />
    ));

    const redirectToGitHub = () => {
        window.location.href = "https://github.com/PROSLab/BPMN-Inspector";
    };

    return <div className="dvd-container">
        <button
            className="centered-button"
            onClick={redirectToGitHub}
            style={{ backgroundColor:"#fafaff", color:"#10ad73",position: "fixed", padding: '10px 20px', borderRadius: '15px', cursor: 'pointer', marginLeft: "30%", marginTop: "20%", zIndex: 1 }}
        >
            <BsGithub style={{ marginBottom: "3px", marginRight: "5px", height:"60px", width:"60px" }} /> GitHub Source Code
            <img style={{marginTop: "5px", position:"relative"}}  src={developer} alt="Animated icons by Lordicon.com" width="70" height="70"/>
        </button>
        {dvdImages}</div>;
};

export default DVDPlayer;