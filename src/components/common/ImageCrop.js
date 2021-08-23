import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import 'react-image-crop/dist/ReactCrop.css';
import { Grid, Tooltip } from '@material-ui/core';
import { LinearLoader } from './Loaders';


export const ImageCrop = ({ imageData, handleImageUpload, uploading = false }) => {
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 60, aspect: 16 / 16 });
    const [completedCrop, setCompletedCrop] = useState(null);


    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);


    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, [completedCrop]);

    return (
        <div>
            <ReactCrop
                src={imageData}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
            />
            <div>
                <canvas
                    ref={previewCanvasRef}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                    style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0),
                        display: "none",
                    }}
                />
            </div>
            {!uploading ?
                <Grid container direction="row" justify="center">
                    <Tooltip title="Update Image" aria-label="Update Image">
                        <IconButton
                            color="secondary"
                            component="span"
                            disabled={!completedCrop?.width || !completedCrop?.height}
                            onClick={() => handleImageUpload(imgRef.current, completedCrop, previewCanvasRef.current)}>
                            <CloudUploadIcon /><span style={{ fontSize: ".7em", marginLeft: "5%" }}>Save</span>
                        </IconButton>
                    </Tooltip>
                </Grid> :
                <LinearLoader />}
        </div>
    );
}
