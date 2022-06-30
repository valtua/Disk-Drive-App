import { Card, Container } from '@mui/material';
import { Add, Delete, Download } from '@mui/icons-material';
import { useToken } from '../../TokenContext';
import { Navigate } from 'react-router-dom';
import './File.css';
import { useEffect, useState } from 'react';

function File() {
    return (
        <div className="File">
            <Container maxWidth="sm"> 
                <Card
                    variant="outlined"
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "5vh",
                    padding: "2vh",
                    background: "rgba(255, 255, 255, 0.25)",
                    borderColor: "white",
                    boxSizing: "border-box",
                    borderRadius: "3vh",
                    py: 17,
                    
                    }}
                    >
                <img
                    style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    borderRadius: "3px 3px 1px 1px",
                    }}
                    src={``}
                    alt={``}
                    loading="lazy"
                />
                <p>File Name:</p>
                <p>Upload Date:</p>
                <p>Size:</p>
                </Card>
            </Container>
        </div>
    );
}
export default File;