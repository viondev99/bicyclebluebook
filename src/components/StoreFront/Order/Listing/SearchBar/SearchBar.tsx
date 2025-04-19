import React from 'react';
import Card from '@ui/Cards';
import Button from '@ui/Buttons/Primary/Button';
import { Form, Formik } from 'formik';
import FormikInput from 'components/Formik/Input/FormikInput';
import images from 'assets/images';
import { useRouter } from 'next/router';
import get from 'lodash/get';
import omit from 'lodash/omit';
import classes from './search-bar.module.scss';

interface FormValues {
  search: string;
}

const SearchBar = () => {
  const { query, replace, pathname } = useRouter();
  const handleFormSubmit = (value: FormValues) => {
    if (value.search.trim() === query.search) {
      return;
    }
    replace({
      pathname,
      query: {
        ...omit(query, ['time_start', 'time_end']),
        search: value.search.trim(),
        page: 1,
      },
    });
  };

  const initialValues: FormValues = {
    search: String(get(query, 'search', '')),
  };

  return (
    <Card className={'mt-3'}>
      <Formik initialValues={initialValues} onSubmit={handleFormSubmit} enableReinitialize={true}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className={classes.searchContainer}>
            <FormikInput
              name="search"
              renderSuffix={
                <Button type="submit" className={'d-block d-md-none icon-button22'} buttonType="transparent">
                  <img src={images.messages.icSearchPrimary} alt={'search'} />
                </Button>
              }
              placeholder={'Search orders'}
              className={classes.searchInput}
            />
            <Button style={{ marginLeft: 16 }} className={'d-none d-md-block'} type="submit">
              Search
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default SearchBar;
