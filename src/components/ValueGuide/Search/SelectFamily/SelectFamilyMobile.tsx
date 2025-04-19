/* eslint-disable no-nested-ternary */
import React, { FC, useState, useEffect } from 'react';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import Card from '@ui/Cards';
import cx from 'classnames';
import _upperCase from 'lodash/upperCase';
import images from 'assets/images';
import Button from '@ui/Buttons/Primary/Button';
import classes from './select-family.module.scss';

interface Props {
  families: Array<string>;
  handleSelectModel: (id: string) => void;
}
const SelectFamilyMobile: FC<Props> = ({ families, handleSelectModel }) => {
  const number = Array.from({ length: 9 }, (_, i) => i + 1).map((it) => String(it));
  let alphabet = [...Array(26).keys()].map((i) => String.fromCharCode(i + 97).toUpperCase());
  alphabet = [...number, ...alphabet];
  const [filteredAlphabet, setFilteredAlphabet] = useState<string>('A');
  const [filteredModels, setFilteredModels] = useState<Array<string>>([]);
  const [firstLoadPage, setfirstLoadPage] = useState(true);

  useEffect(() => {
    if (families.length > 0) {
      const char = families[0];
      setFilteredAlphabet(char);
      const filteredModelsByChar = families.filter((item: string) => {
        return _upperCase(item[0]) === _upperCase(char);
      });
      setFilteredModels(filteredModelsByChar);
      setfirstLoadPage(false);
    }
  }, [families]);

  const onChangeFilteredAlphabet = (char: string) => {
    setFilteredAlphabet(char);
    const filteredModelsByChar = families.filter((item: string) => {
      return _upperCase(item[0]) === _upperCase(char);
    });
    setFilteredModels(filteredModelsByChar);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.alphabet}>
        {alphabet.map((char: string) => (
          <Button
            key={char}
            buttonType="clear"
            className={cx(classes.item, { [classes.active]: char === filteredAlphabet && !firstLoadPage })}
            onClick={() => onChangeFilteredAlphabet(char)}>
            <span>{char}</span>
          </Button>
        ))}
      </div>
      {alphabet.includes(filteredAlphabet) && (
        <>
          {filteredModels?.length ? (
            <Card className={classes.mobileCard}>
              <Row>
                {filteredModels.map((item: string) => (
                  <Col xs={12} key={item} className={classes.family} onClick={() => handleSelectModel(item)}>
                    <span className={classes.name}>{item}</span>
                    <img src={images.valueGuide.icNextGray} alt="icon_next" />
                  </Col>
                ))}
              </Row>
            </Card>
          ) : !firstLoadPage ? (
            <Card className={classes.notFound}>We’re sorry, We don’t have details for this model</Card>
          ) : null}
        </>
      )}
    </div>
  );
};

export default SelectFamilyMobile;
