import { IntroCountdown } from './IntroCountdown';

export default  () => {
    return (
        <IntroCountdown
            displayName="TansanVision"
            iconUrl="https://static-cdn.jtvnw.net/jtv_user_pictures/afdc1d67-8c1f-494b-ae22-fbfbb015a081-profile_image-70x70.png"
            viewerCount={5}
            countdownTime={60}
            onFinished={() => console.log('Countdown finished')}
        />
    );
}