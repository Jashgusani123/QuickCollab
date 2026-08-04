import Header from "./header";
import { NoticeList } from "./notice_list";
export default function notice() {
    return (
        <div className="h-full flex-1">
        <Header />
        <NoticeList />
        </div>
    )
}