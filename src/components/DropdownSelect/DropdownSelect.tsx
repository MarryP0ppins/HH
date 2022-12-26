import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@bem-react/classname';
import { OpenSelectorIcon } from 'assets';
import { useClickOutside } from 'hooks/useClickOutside';

import { DropdownSelectProps } from './DropdownSelect.types';

import './DropdownSelect.scss';

const cnDropdownSelect = cn('dropdownSelect');

export const DropdownSelect: React.FC<DropdownSelectProps> = ({ options, onChange }) => {
    const [title, setTitle] = useState<string>(options[0]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        onChange(title);
    }, [onChange, title]);
    
    const refEl = useRef<HTMLDivElement>(null);
    
    const onClickOption = useCallback(
        (item: string) => () => {
            setTitle(item);
            setIsOpen(false);
        },
        [],
    );
    const onClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
        event.stopPropagation();
        setIsOpen((prevState) => !prevState);
    }, []);
    const onClickOutside = useCallback(() => {
        setIsOpen(false);
    }, []);
    
    useClickOutside(refEl, onClickOutside);
    return (
        <div className={cnDropdownSelect()} ref={refEl}>
            <div className={cnDropdownSelect('title-wrapper', { isOpen: isOpen })} onClick={onClick}>
                <div className={cnDropdownSelect('title')}>{title ?? 'Выберите пользователя'}</div>
                <OpenSelectorIcon className={cnDropdownSelect('icon', { isOpen: isOpen })} />
            </div>
            {isOpen && (
                <div className={cnDropdownSelect('options')}>
                    {options?.map((item, index) => (
                        <div
                            className={cnDropdownSelect('option', { current: item === title })}
                            key={index}
                            onClick={onClickOption(item)}
                            //hovering={hovering}
                        >
                            <div className={cnDropdownSelect('title')}>{item}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
