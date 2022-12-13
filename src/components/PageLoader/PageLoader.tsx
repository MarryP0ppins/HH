import React, { useEffect, useState } from 'react';
import { cn } from '@bem-react/classname';
import { LoaderArrows } from 'assets';
import { useAppSelector } from 'store/store';

import { PageLoaderProps } from 'components/PageLoader/PageLoader.types';

import './PageLoader.scss';

const CnPageLoader = cn('pageLoader');

export const PageLoader: React.FC<PageLoaderProps> = ({ zIndex }) => {
    const { isLoading } = useAppSelector((store) => store.loader);
    const [isShow, setIsShow] = useState(true);

    useEffect(() => {
        setIsShow(true);

        const setTimeoutId = setTimeout(() => {
            setIsShow(false);
        }, 1000);

        return () => {
            clearTimeout(setTimeoutId);
        };
    }, [isLoading]);

    if (isShow || isLoading) {
        return (
            <div className={CnPageLoader()} style={{ zIndex }}>
                <div className={CnPageLoader('loader')}>
                    <LoaderArrows width={300} height={300}/>
                </div>
            </div>
        );
    }

    return null;
};
