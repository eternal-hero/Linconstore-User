import { NextPage } from "next";
import { useRouter } from 'next/router'
import ForumChat from "../../../Components/Forum/ForumChat";

const ForumChatPage: NextPage = () => {
    const router = useRouter()
    const { slug } = router.query;
    return <ForumChat slug={slug?.toString()} />;
};

export default ForumChatPage;