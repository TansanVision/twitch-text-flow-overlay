import { Toast } from './Toast';

export default () => {
    return <Toast message="これはトーストメッセージです" variant="error" onClose={() => console.log("トーストが閉じられました")} />
}
