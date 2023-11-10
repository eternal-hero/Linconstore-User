import React from 'react';
import Nav from '../Layouts/Nav';
import Wrapper from '../Wappers/Container';
import ContentHeader from '../Utils/contentHeader';
import Footer from '../Layouts/Footer';
import { Container, Grid } from '@mui/material';
import { Quiz, Toll, ConnectWithoutContact, Laptop } from '@mui/icons-material';
import CollapseItem from './CollapseItem';
import { useTranslation } from "react-i18next";

const Questions: React.FC = () => {
    const { t } = useTranslation();

    type QuestionType = {
        title: string,
        content: string[],
    }

    const questions: QuestionType[] = [
        {
            title: t("helpcenter.q1"),
            content: [t("helpcenter.a1")]
        },
        {
            title: t("helpcenter.q2"),
            content: [t("helpcenter.a2")]
        }, 
        {
            title: t("helpcenter.q3"),
            content: [t("helpcenter.a3")]
        },
        {
            title: t("helpcenter.q4"),
            content: [t("helpcenter.a4")]
        },
        {
            title: t("helpcenter.q5"),
            content: [t("helpcenter.a5")]
        }, 
        {
            title: t("helpcenter.q6"),
            content: [t("helpcenter.a6")]
        },
        {
            title: t("helpcenter.q7"),
            content: [t("helpcenter.a7")]
        },
        {
            title: t("helpcenter.q8"),
            content: [t("helpcenter.a8")]
        },
        {
            title: t("helpcenter.q9"),
            content: [t("helpcenter.a9")]
        },
        {
            title: t("helpcenter.q10"),
            content: [t("helpcenter.a10")]
        },
        {
            title: t("helpcenter.q11"),
            content: [t("helpcenter.a11")]
        },
        {
            title: t("helpcenter.q12"),
            content: [t("helpcenter.a12")]
        },
        {
            title: t("helpcenter.q13"),
            content: [t("helpcenter.a13")]
        },
        {
            title: t("helpcenter.q14"),
            content: [t("helpcenter.a14")]
        },
        {
            title: t("helpcenter.q15"),
            content: [t("helpcenter.a15")]
        },
        {
            title: t("helpcenter.q16"),
            content: [t("helpcenter.a16")]
        },
        {
            title: t("helpcenter.q17"),
            content: [t("helpcenter.a17")]
        },
        {
            title: t("helpcenter.q18"),
            content: [t("helpcenter.a18")]
        },
        {
            title: t("helpcenter.q19"),
            content: [t("helpcenter.a19")]
        },
        {
            title: t("helpcenter.q20"),
            content: [t("helpcenter.a20")]
        },
        {
            title: t("helpcenter.q21"),
            content: [t("helpcenter.a21")]
        },
        {
            title: t("helpcenter.q22"),
            content: [t("helpcenter.a22")]
        },
        {
            title: t("helpcenter.q23"),
            content: [t("helpcenter.a23")]
        },
        {
            title: t("helpcenter.q24"),
            content: [t("helpcenter.a24")]
        },
        {
            title: t("helpcenter.q25"),
            content: [t("helpcenter.a25")]
        },
        {
            title: t("helpcenter.q26"),
            content: [t("helpcenter.a26")]
        },
        {
            title: t("helpcenter.q27"),
            content: [t("helpcenter.a27")]
        },
        {
            title: t("helpcenter.q28"),
            content: [t("helpcenter.a28")]
        },
        {
            title: t("helpcenter.q29"),
            content: [t("helpcenter.a29")]
        },
        {
            title: t("helpcenter.q30"),
            content: [t("helpcenter.a30")]
        },
        {
            title: t("helpcenter.q31"),
            content: [t("helpcenter.a31")]
        },
        {
            title: t("helpcenter.q32"),
            content: [t("helpcenter.a32")]
        },
        {
            title: t("helpcenter.q33"),
            content: [t("helpcenter.a33")]
        },
        {
            title: t("helpcenter.q34"),
            content: [t("helpcenter.a34")]
        },
        {
            title: t("helpcenter.q35"),
            content: [t("helpcenter.a35")]
        },
        {
            title: t("helpcenter.q36"),
            content: [t("helpcenter.a36")]
        },
        {
            title: t("helpcenter.q37"),
            content: [t("helpcenter.a37")]
        },
        {
            title: t("helpcenter.q38"),
            content: [t("helpcenter.a38")]
        },
        {
            title: t("helpcenter.q39"),
            content: [t("helpcenter.a39")]
        },
        {
            title: t("helpcenter.q40"),
            content: [t("helpcenter.a40")]
        },
        {
            title: t("helpcenter.q41"),
            content: [t("helpcenter.a41")]
        },
    ]

    return (
        <>
            <Nav />
            <Wrapper
                title={t("pagetitle.Frequent_Questions")}
                description={
                "Frequent Questions on Linconstore"
                }
                content={"Frequent Questions | linconstore"}
            >
                <ContentHeader 
                    title={t("helpcenter.Frequently_asked_questions")}
                    search
                    paths={[t("helpcenter.title"), t("helpcenter.Frequently_asked_questions")]}
                    iconComponent={<Quiz sx={{color: "var(--primary)"}} />}
                    routePath='/help-center'
                />

                <Container component={"main"} maxWidth={"md"} sx={{my: 10}}>
                    {
                        questions.map((question, index) => {
                            return (
                                <CollapseItem title={question.title} content={question.content} key={index} />
                            )
                        })
                    }
                </Container>


                <Footer />
            </Wrapper>
        </>
    )
} 

export default Questions