import React, { ChangeEvent, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Card, CircularProgress, FormHelperText, IconButton, Typography, useMediaQuery } from "@mui/material";
import {
    AttachmentOutlined,
    HighlightOffOutlined,
    SendOutlined,
} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import { ChatRole, addCurrentChatMessage, addMessageToSpecificBuyer } from "../../Store/chat";
import axios from "axios";
import Image from "next/image";
import Nav from "../Layouts/Nav";
import Wrapper from "../Wappers/Container";
import Footer from "../Layouts/Footer";
import { useTranslation } from "react-i18next";

const schema = yup.object().shape({
    message: yup.string().required().min(4),
    attachment: yup
        .mixed()
        .test("fileSize", "File Size is too large", (value) => {
            if (value) {
                return value.size <= 2000000;
            } else {
                return true;
            }
        })
        .test("fileType", "Unsupported File Format", (value) => {
            if (value) {
                return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
            }
            return true;
        }),
});
type Chat = {
    message: string;
    attachment: File | null;
};


const ForumRoom: React.FC = () => {
    const { t } = useTranslation();
    const {
        handleSubmit,
        control,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Chat>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {
            message: "",
            attachment: null,
        },
    });

    const isMobile = useMediaQuery("(max-width: 600px)");

    const [imageData, setImageData] = useState(null)

    const [isLoadingImage, setIsLoadingImage] = useState(false)

    const uploadImage = async (image) => {

        const data = new FormData();

        if (image) {
            setIsLoadingImage(true);

            data.append('file', image as unknown as string);
            data.append("upload_preset", "linconstore");
            data.append("cloud_name", "linconstore-cloud")


            try {
                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/linconstore-cloud/image/upload",
                    data,
                    {
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                        },
                    }
                );
                setImageData(() => response.data);

            } catch (e) {
                console.log(e);
            }

        }
        setIsLoadingImage(false);
    }

    return (
        <>
            <Nav />
            <Card elevation={0} sx={{ borderRadius: "0px" }}>
                <Wrapper
                    title={t("pagetitle.Forum_chat")}
                    description={"Learn what cookies we use when you visit linconstore"}
                    content={"Forum chat | linconstore"}
                >
                    <Container component={"main"} maxWidth={"lg"} sx={{ my: 10 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", mb: 3, height: isMobile ? "calc(100vh - 85px)" : "calc(100vh - 48px)" }}>
                            <Box className="msger-chat">
                                <div className="msg right-msg">
                                    <div className="msg-bubble">
                                        <div className="msg-info">
                                            <div className="msg-info-name">
                                                John
                                            </div>
                                            <div className="msg-info-time">11.20</div>
                                        </div>
                                        <div className="msg-text">
                                            How can I sell on Linconstore
                                        </div>
                                    </div>
                                </div>
                                <div className="msg left-msg">
                                    <div className="msg-bubble">
                                        <div className="msg-info">
                                            <div className="msg-info-name">
                                                James
                                            </div>
                                            <div className="msg-info-time">11.30</div>
                                        </div>
                                        <div className="msg-text">
                                            Who are you?
                                        </div>
                                    </div>
                                </div>
                            </Box>

                            <Box
                                sx={{
                                    "& .MuiTextField-root": { m: 1 },
                                }}
                                component={"form"}
                                // onSubmit={handleSubmit(onSubmit)}
                                noValidate
                            >
                                <FormHelperText sx={{ color: "red" }}>
                                    {/* {errors?.attachment?.message} */}
                                </FormHelperText>
                                <Box sx={{ display: "flex", alignItems: 'center' }}>
                                    {isLoadingImage ? <Box sx={{
                                        width: '61px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}><CircularProgress /></Box> :
                                        <Controller
                                            name="attachment"
                                            control={control}
                                            render={({ field: { onChange }, formState: { errors } }) => (
                                                <IconButton
                                                    color="primary"
                                                    aria-label="attachment"
                                                    component="label"
                                                >
                                                    <input
                                                        hidden
                                                        accept="image/*"
                                                        type="file"
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            // setValue(
                                                            //     "attachment",
                                                            //     e.target.files && e.target.files[0]
                                                            // );
                                                            uploadImage(e.target.files.length && e.target.files[0])
                                                        }}
                                                    />
                                                    <AttachmentOutlined color={"success"} />
                                                </IconButton>
                                            )}
                                        />
                                    }
                                    <Box position={'relative'} width={'100%'} marginRight={'10px'}>
                                        <Controller
                                            name="message"
                                            control={control}
                                            render={({
                                                field: { onChange, value },
                                                formState: { errors },
                                            }) => (
                                                <TextField
                                                    id="outlined-multiline-flexible"
                                                    fullWidth
                                                    size={"small"}
                                                    sx={{
                                                        minHeight: 45,
                                                        border: "2px solid #00a866",
                                                        borderRadius: "29px",
                                                        "& fieldset": {
                                                            border: "none !important",
                                                            outline: "none !important",
                                                        },
                                                    }}
                                                    InputLabelProps={{
                                                        style: { color: "#00a859", marginTop: 3 },
                                                    }}
                                                    multiline
                                                    onChange={onChange}
                                                    value={value}
                                                    error={!!errors?.message}
                                                    // helperText={errors?.message?.message}
                                                    variant={"outlined"}
                                                    required
                                                    maxRows={4}
                                                />
                                            )}
                                        />
                                        {/* {imageData &&  */}
                                        <Box className="upload-img-box" sx={{
                                            bottom: '100%',
                                            height: imageData ? '41px' : '0px',
                                            opacity: imageData ? 1 : 0,
                                            zIndex: imageData ? 10 : '-10',
                                        }}>
                                            <Box sx={{ flexShrink: 0, height: '27px', border: '1px solid white' }}>
                                                <Image
                                                    height={27}
                                                    width={30}
                                                    src={imageData?.secure_url}
                                                    placeholder="blur"
                                                    blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                                                    alt="product-icon"
                                                    style={{ borderRadius: '3px' }}
                                                />
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '8px',
                                                width: '100%'
                                            }}>
                                                <Typography className="upload-img-text text-ellipsis">{imageData?.original_filename}</Typography>
                                                <HighlightOffOutlined className={"pointer"} onClick={() => setImageData(null)} />
                                            </Box>
                                        </Box>
                                        {/* } */}
                                    </Box>
                                    <IconButton
                                        type={isLoadingImage ? "button" : "submit"}
                                        color="success"
                                        aria-label="message seller"
                                        style={{ position: "relative" }}
                                    >
                                        {/*<FontAwesomeIcon style={{color: '#00a859'}} icon={faComment}/>*/}
                                        <SendOutlined />
                                        {isLoadingImage && <Box sx={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            height: '100%',
                                            width: '100%',
                                            zIndex: 30,
                                            backgroundColor: 'white',
                                            opacity: '.6'
                                        }}></Box>}
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Container>

                    <Footer />
                </Wrapper>
            </Card>
        </>
    );
};
export default ForumRoom;
