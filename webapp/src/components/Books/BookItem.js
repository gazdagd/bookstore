import React from 'react';
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import FavoriteOutlinedIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import Zoom from "@material-ui/core/Zoom";

import { useKeycloak } from '@react-keycloak/web';
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        height: 'inherit',
        textAlign: 'center',
        backgroundColor: "#fff",
        verticalAlign: 'bottom',
        transition: 'backgroundImage .2s ease-in-out',
        '&:hover': {
            maskImage: 'linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9))',
            transition: 'maskImage .2s ease-in-out',
        },
    },
    grow: {
        flexGrow: 1
    },
    media: {
        //textAlign: 'bottom',
        //marginBottom: '15px',
        cursor: 'pointer',
        //verticalAlign: 'sub'
        //bottom: 0
    },
    images: {
        height: 280,
        width: 'auto',
        display: 'inline',
        borderRadius: '5px',
    },
}));

const BookItem = ({ book, ...props }) => {
    const classes = useStyles();
    const { keycloak } = useKeycloak();

    const getTransitionDelay = (multiplier) => {
        return (multiplier * 100) + 'ms';
    }

    const action = () => {
        if (keycloak.authenticated) {
            return <IconButton aria-label="add to favorites" onClick={() => props.toggleWished(book.olid)}>
                {book.wished ? <FavoriteIcon color="primary" /> : <FavoriteOutlinedIcon color="primary" />}
            </IconButton>
        } else return null;
    }

    return (
        <Zoom in={true} style={{ transitionDelay: getTransitionDelay(props.delay) }}>

            <Card className={classes.card}>
                <CardHeader
                    titleTypographyProps={{
                        variant: "h6"
                    }}
                    action={action()}
                    title={book.title}
                    style={{ width: 'auto' }}
                />
                <div className={classes.grow}></div>
                <Link to={"/books/" + book.olid}>
                    <CardMedia
                        component="img"
                        className={classes.media}
                        classes={{
                            img: classes.images
                        }}
                        image={`http://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                        title={book.title}
                    />
                </Link>
                <CardContent>
                </CardContent>
            </Card>
        </Zoom>
    );
}


export default React.memo(BookItem);