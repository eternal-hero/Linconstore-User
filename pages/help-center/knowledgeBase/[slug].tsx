import { NextPage } from "next";
import { useRouter } from "next/router";
import KnowledgeBaseContent from "../../../Components/KnowledgeBase/KnowledgeBaseContent";

const KnowledgeBasePage: NextPage = () => {
    const router = useRouter()
    const { slug } = router.query;
  return <KnowledgeBaseContent slug={slug?.toString()} />;
};

export default KnowledgeBasePage;