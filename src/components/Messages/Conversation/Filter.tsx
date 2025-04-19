import React, { FC, useState, useMemo, useCallback } from 'react';
import cx from 'classnames';

import images from 'assets/images';

import { StateConversation } from 'model/store/message.model';
import Card from '@ui/Cards';
import Select from '@ui/Select/Select';
import Input from '@ui/Inputs/Input';
import Button from '@ui/Buttons/Primary/Button';
import ImageButton from '@ui/Buttons/ImageButton/ImageButton';
import Pagination from './Pagination/Pagination';
import classes from './conversation.module.scss';

const stateOptions = [
  { label: 'All', value: StateConversation.All },
  { label: 'Unread', value: StateConversation.Unread },
  { label: 'Flagged', value: StateConversation.Flagged },
];

interface Props {
  show: boolean;
  state: StateConversation;
  page: number;
  total: number;
  onChangeState: (state: { label: string; value: StateConversation }) => void;
  onChangePage: (page: number) => void;
  onChangeSearch: (value: string) => void;
  onChangeShow: () => void;
}

const Filter: FC<Props> = (props) => {
  const { show, state, page, total, onChangeState, onChangePage, onChangeSearch, onChangeShow } = props;
  const [text, setText] = useState('');

  const styleSearch = useMemo(() => {
    if (show) {
      return { height: 95, marginTop: 20, padding: '20px 30px', opacity: 1 };
    }
    return { height: 0, marginTop: 0, padding: '0px 30px', opacity: 0 };
  }, [show]);

  const styleSearchMobile = useMemo(() => {
    if (show) {
      return { height: 55, marginTop: 20, opacity: 1 };
    }
    return { height: 0, marginTop: 0, opacity: 0 };
  }, [show]);

  const onChangeInput = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onSubmitSearch = useCallback(
    (e) => {
      e.preventDefault();
      onChangeSearch(text);
      onChangePage(1);
    },
    [text, onChangeSearch, onChangePage],
  );

  return (
    <section>
      <Card className={classes.cardHorizontal}>
        <div className={classes.selectContainer}>
          <Select
            inputId={'filter-message-conversation'}
            selectStyles={{ control: { backgroundColor: 'transparent' }, singleValue: { color: '#1b2028' } }}
            value={state}
            options={stateOptions}
            onChange={onChangeState}
          />
        </div>
        <div className={classes.contentContainer}>
          <Pagination page={page} pageSize={10} total={total} onChangePage={onChangePage} />
          <ImageButton className={classes.searchButton} onClick={onChangeShow}>
            <img
              className={classes.searchIcon}
              src={show ? images.messages.icSearchPrimary : images.messages.icSearchBlack}
              alt={'search-icon'}
            />
          </ImageButton>
        </div>
      </Card>
      <Card className={cx(classes.cardSearch, 'd-none', 'd-sm-flex')} style={styleSearch}>
        <form className={classes.formSearch} onSubmit={onSubmitSearch}>
          <Input
            className={classes.inputSearch}
            placeholder={'Search messages'}
            value={text}
            onChange={onChangeInput}
          />
          <Button type="submit">Search</Button>
        </form>
      </Card>
      <Card className={cx(classes.cardSearch, 'd-flex', 'd-sm-none')} style={styleSearchMobile}>
        <form className={classes.formSearch} onSubmit={onSubmitSearch} action="Search">
          <Input
            type="search"
            className={classes.inputSearch}
            placeholder={'Search messages'}
            value={text}
            onChange={onChangeInput}
            renderSuffix={
              <Button className={classes.inputSuffix} type="submit">
                Search
              </Button>
            }
          />
        </form>
      </Card>
    </section>
  );
};

export default Filter;
