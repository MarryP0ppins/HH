import React from 'react';
import { cn } from '@bem-react/classname';
import { AvatarIcon, RubIcon, StarIcon } from 'assets';

import { ServiceCardProps } from 'components/ServiceCard/ServiceCard.types';

import './ServiceCard.scss';

const cnServiceCard = cn('service-card');

export const ServiceCard: React.FC<ServiceCardProps> = ({ serviceInfo }) => {
    return (
        <div className={cnServiceCard()}>
            <AvatarIcon />
            <div className={cnServiceCard('about')}>
                <div className={cnServiceCard('title')}>{serviceInfo.title}</div>
                <div className={cnServiceCard('info-stars')}>
                    <div className={cnServiceCard('description')}>Рейтинг исполнителя:</div>
                    {[...Array<number>(serviceInfo.rating < 0 ? 0 : serviceInfo.rating)].map((_, index) => (
                        <StarIcon key={index} width={10} height={10} />
                    ))}
                </div>
                <div className={cnServiceCard('info')}>
                    <RubIcon width={14} height={14} />
                    <div className={cnServiceCard('description')}>{`${serviceInfo.price}руб.`}</div>
                </div>
            </div>
        </div>
    );
};
