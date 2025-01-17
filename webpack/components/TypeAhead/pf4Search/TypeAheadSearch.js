import React from 'react';
import { InputGroup, Button } from '@patternfly/react-core';
import { TimesIcon, SearchIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

import keyPressHandler from '../helpers/helpers';
import TypeAheadInput from './TypeAheadInput';
import TypeAheadItems from './TypeAheadItems';
import commonSearchPropTypes from '../helpers/commonPropTypes';

const TypeAheadSearch = ({
  userInputValue, clearSearch, getInputProps, getItemProps, isOpen, inputValue, highlightedIndex,
  selectedItem, selectItem, openMenu, onSearch, items, activeItems, shouldShowItems,
  autoSearchEnabled, isDisabled,
}) => (
  <React.Fragment>
    <InputGroup>
      <TypeAheadInput
        isDisabled={isDisabled}
        onKeyPress={
          (e) => {
            keyPressHandler(
              e,
              isOpen,
              activeItems,
              highlightedIndex,
              selectItem,
              userInputValue,
              onSearch,
            );
          }
        }
        onInputFocus={openMenu}
        passedProps={getInputProps()}
        autoSearchEnabled={autoSearchEnabled}
      />
      <React.Fragment>
        {userInputValue &&
          <Button
            variant={autoSearchEnabled ? 'plain' : 'control'}
            className="foreman-pf4-search-clear"
            onClick={clearSearch}
          >
            <TimesIcon />
          </Button>}
      </React.Fragment>
      {!autoSearchEnabled &&
        <Button aria-label="search button" variant="control" onClick={() => onSearch(inputValue)}>
          <SearchIcon />
        </Button>}
    </InputGroup>
    <TypeAheadItems
      isOpen={shouldShowItems}
      {...{
        items, highlightedIndex, selectedItem, getItemProps, activeItems,
      }}
    />
  </React.Fragment>
);

TypeAheadSearch.propTypes = {
  isDisabled: PropTypes.bool,
  autoSearchEnabled: PropTypes.bool.isRequired,
  ...commonSearchPropTypes,
};

TypeAheadSearch.defaultProps = {
  isDisabled: undefined,
};

export default TypeAheadSearch;
