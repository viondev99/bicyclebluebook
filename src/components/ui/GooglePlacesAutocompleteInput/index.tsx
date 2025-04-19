/* eslint-disable no-return-assign */
/* eslint-disable react/sort-comp */
import { loadScriptAsync } from 'helpers/utilities.helper';
import React, { useCallback, useEffect, useRef } from 'react';
import config from 'config';
import FormikInput from 'components/Formik/Input/FormikInput';

export interface InfoGooglePlacesAutocompleteInput {
  city: string;
  state: string;
  zip: string;
  address: string;
}

interface Props {
  name: string;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  handleChangeAddressForm: (values: InfoGooglePlacesAutocompleteInput) => void;
}

const GooglePlacesAutocompleteInput: React.FC<Props> = (props) => {
  const { handleChangeAddressForm, ...other } = props;
  const formInputRef = useRef(null);

  const initMapScript = useCallback(() => {
    if (window?.google) {
      return Promise.resolve();
    }
    const src = `https://maps.googleapis.com/maps/api/js?key=${config.GG_MAP_API}&v=3.exp&libraries=geometry,drawing,places`;
    return loadScriptAsync(src);
  }, []);

  const axtractAddress = useCallback((place) => {
    const infoAddress: InfoGooglePlacesAutocompleteInput = {
      city: '',
      state: '',
      zip: '',
      address: '',
    };

    if (!place.address_components || !Array.isArray(place.address_components)) {
      return infoAddress;
    }

    place.address_components.forEach((component: any) => {
      const types = component?.types;
      const value = component.long_name;
      const valueShort = component.short_name;

      if (types.includes('street_number')) {
        infoAddress.address = `${infoAddress.address}${value} `;
      }
      if (types.includes('route')) {
        infoAddress.address = `${infoAddress.address}${value}`;
      }
      if (types.includes('locality')) {
        infoAddress.city = value;
      }
      if (types.includes('administrative_area_level_1')) {
        infoAddress.state = valueShort;
      }
      if (types.includes('postal_code')) {
        infoAddress.zip = value;
      }
    });

    return infoAddress;
  }, []);

  const onChangeAddress = useCallback(
    (autocomplete) => {
      const place = autocomplete.getPlace();
      const detailAddress = axtractAddress(place);
      handleChangeAddressForm(detailAddress);
    },
    [axtractAddress, handleChangeAddressForm],
  );

  const initAutocomplete = useCallback(() => {
    const autocomplete = new google.maps.places.Autocomplete(formInputRef?.current);
    autocomplete.setFields(['address_component', 'geometry']);
    autocomplete.addListener('place_changed', () => onChangeAddress(autocomplete));
  }, [onChangeAddress]);

  const handleGetDefault = useCallback(async () => {
    await initMapScript();
    initAutocomplete();
  }, [initAutocomplete, initMapScript]);

  useEffect(() => {
    handleGetDefault();
  }, []);

  return <FormikInput {...other} formInputRef={formInputRef} />;
};

export default GooglePlacesAutocompleteInput;
