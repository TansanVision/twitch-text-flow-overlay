import type { Clip } from '../../domain/types';
import { ClipPlayer } from './ClipPlayer';

export default () => {
    const clips: Clip[] = [{
        videoUrl: 'https://d1ndex63qxojbr.cloudfront.net/nauth/4920a7fe-7b78-4476-bd61-c10f52a9c7bb/landscape/avc/360/index.mp4?token=%7B%22authorization%22%3A%7B%22forbidden%22%3Afalse%2C%22reason%22%3A%22%22%7D%2C%22clip_uri%22%3A%22https%3A%2F%2Fd1ndex63qxojbr.cloudfront.net%2Fnauth%2F4920a7fe-7b78-4476-bd61-c10f52a9c7bb%2Flandscape%2Favc%2F1080%2Findex.mp4%22%2C%22clip_slug%22%3A%22TolerantLivelyJaguarTinyFace-ROt8OBlcWpdZfvGS%22%2C%22device_id%22%3A%22c0cc4f02dbf549f8b2a5bb5128be4358%22%2C%22expires%22%3A1781336343%2C%22user_id%22%3A%221013815121%22%2C%22version%22%3A3%7D&sig=e2f90691edb43110ac2c6da1ecf27b07889d5927',
        title: '⭐可愛くてかっこいいネメシスちゃん⭐',
        duration: 6,
    }, {
        videoUrl: 'https://d1ndex63qxojbr.cloudfront.net/nauth/f30f0cce-032c-4058-be74-2d96883d46aa/landscape/avc/360/index.mp4?token=%7B%22authorization%22%3A%7B%22forbidden%22%3Afalse%2C%22reason%22%3A%22%22%7D%2C%22clip_uri%22%3A%22https%3A%2F%2Fd1ndex63qxojbr.cloudfront.net%2Fnauth%2Ff30f0cce-032c-4058-be74-2d96883d46aa%2Flandscape%2Favc%2F360%2Findex.mp4%22%2C%22clip_slug%22%3A%22TriumphantArbitraryMonitorJebaited-3Ewsn5cL9VoyD6ok%22%2C%22device_id%22%3A%22c0cc4f02dbf549f8b2a5bb5128be4358%22%2C%22expires%22%3A1781336188%2C%22user_id%22%3A%221013815121%22%2C%22version%22%3A3%7D&sig=b29373d490b3d054e98b1d5f2fbf2f6da67287de',
        title: 'え？',
        duration: 14,
    }, {
        videoUrl: 'https://d1ndex63qxojbr.cloudfront.net/nauth/a2ea0698-2205-47c1-aaa9-c63239fa08ee/landscape/avc/360/index.mp4?token=%7B%22authorization%22%3A%7B%22forbidden%22%3Afalse%2C%22reason%22%3A%22%22%7D%2C%22clip_uri%22%3A%22https%3A%2F%2Fd1ndex63qxojbr.cloudfront.net%2Fnauth%2Fa2ea0698-2205-47c1-aaa9-c63239fa08ee%2Flandscape%2Favc%2F1080%2Findex.mp4%22%2C%22clip_slug%22%3A%22MistyDullLaptopAllenHuhu-QH-vuPu57WtAKqMk%22%2C%22device_id%22%3A%22c0cc4f02dbf549f8b2a5bb5128be4358%22%2C%22expires%22%3A1781336422%2C%22user_id%22%3A%221013815121%22%2C%22version%22%3A3%7D&sig=023a1a0f75acdc4bd2b958cc41cb7f846a835e89',
        title: '( ˘ω˘)ｽﾔｧ',
        duration: 60,
    }];
        
    return <div style={{ width: '100%', height: '100%' }}><ClipPlayer clips={clips} onFinished={() => {}} /></div>;
}
