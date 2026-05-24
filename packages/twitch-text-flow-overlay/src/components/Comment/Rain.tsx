import { css } from "@emotion/css";

const rain = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    margin: auto;
    width: 100vw;

    & div {
        position: absolute;
        width: 1px;
        height: 100%;
        top: 0;
        left: 50%;
        overflow: hidden;
    }

    & div::after {
        content: "";
        display: block;
        position: absolute;
        height: 20vh;
        width: 100%;
        top: -50%;
        left: 0;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #ffffff 80%, #ffffff 100%);
        animation: drop 2.8s 0s infinite;
        animation-fill-mode: forwards;
        opacity: .6;
        animation-duration: 10s;
        animation-fill-mode: forwards;
        animation-iteration-count: 3;
    }

    & div:nth-child(1) {
        margin-left: -40%;
    }

    & div:nth-child(1)::after {
        animation-delay: 1.2s;
    }
    & div:nth-child(2) {
        margin-left: -30%;
    }
    & div:nth-child(2)::after {
        animation-delay: 2.5s;
    }
    & div:nth-child(3) {
        margin-left: -20%;
    }
    & div:nth-child(3)::after {
        animation-delay: .6s;
    }
    & div:nth-child(4) {
        margin-left: -10%;
    }
    & div:nth-child(4)::after {
        animation-delay: 2.3s;
    }
    & div:nth-child(5) {
        margin-left: 0%;
    }
    & div:nth-child(5)::after {
        animation-delay: 1s;
    }
    & div:nth-child(6) {
        margin-left: 10%;
    }
    & div:nth-child(6)::after {
        animation-delay: .3s;
    }
    & div:nth-child(7) {
        margin-left: 20%;
    }
    & div:nth-child(7)::after {
        animation-delay: 2.6s;
    }
    & div:nth-child(8) {
        margin-left: 30%;
    }
    & div:nth-child(8)::after {
        animation-delay: 1.9s;
    }
    & div:nth-child(9) {
        margin-left: 40%;
    }
    & div:nth-child(9)::after {
        animation-delay: .7s;
    }

    @keyframes drop {
        0% {
            top: -50%;
        }
        100% {
            top: 150%;
        }
    }
  `;

export const Rain: React.FC<{ onAnimationEnd?: () => void }> = ({ onAnimationEnd }) => {
    return <div className={rain}>
        <div onAnimationEnd={onAnimationEnd}></div>
        <div onAnimationEnd={onAnimationEnd}></div>
        <div onAnimationEnd={onAnimationEnd}></div>
        <div onAnimationEnd={onAnimationEnd}></div>
        <div onAnimationEnd={onAnimationEnd}></div>
        <div onAnimationEnd={onAnimationEnd}></div>
        <div onAnimationEnd={onAnimationEnd}></div>
        <div onAnimationEnd={onAnimationEnd}></div>
    </div>
}