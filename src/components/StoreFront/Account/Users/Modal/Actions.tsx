import React, { FC, useState, useRef, useEffect, useCallback } from 'react';

import images from 'assets/images';

import classes from '../users.module.scss';
import Button from '@ui/Buttons/Primary/Button';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';

interface Props {
  onEdit: () => void;
  onRemove: () => void;
}

const Actions: FC<Props> = (props) => {
  const [show, setShow] = useState<boolean>(false);
  const actionRef = useRef<HTMLDivElement>(null);

  const toggleAction = useCallback(() => {
    setShow(!show);
  }, [show]);

  const onHidden = useCallback(
    (e) => {
      if (actionRef.current && !actionRef.current.contains(e.target)) {
        toggleAction();
      }
    },
    [actionRef, toggleAction],
  );

  useEffect(() => {
    document.addEventListener('mousedown', onHidden);
    return () => document.removeEventListener('mousedown', onHidden);
  }, [onHidden]);

  const onEdit = useCallback(() => {
    props.onEdit();
  }, [props.onEdit]);

  const onRemove = useCallback(() => {
    props.onRemove();
  }, [props.onRemove]);

  return (
    <>
      <div className={classes.actionsContainer}>
        {show && (
          <div className={classes.actionsContent} ref={actionRef}>
            <Button className={classes.buttonAction} buttonType="transparent" onClick={onEdit}>
              Edit
            </Button>
            <Button className={classes.buttonAction} buttonType="transparent" onClick={onRemove}>
              Remove
            </Button>
          </div>
        )}
      </div>
      <div className={classes.buttonMoreAction}>
        <ImageButton onClick={toggleAction} style={{ margin: '-5px -20px' }}>
          <img src={images.messages.icMoreAction} alt={'more-icon'} />
        </ImageButton>
      </div>
    </>
  );
};

export default Actions;
