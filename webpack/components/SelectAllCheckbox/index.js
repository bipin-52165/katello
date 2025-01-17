import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownToggleCheckbox,
  DropdownItem } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

import './SelectAllCheckbox.scss';

const SelectAllCheckbox = ({
  // selectAll,
  selectNone,
  selectPage,
  selectedCount,
  pageRowCount,
  // totalCount,
  areAllRowsOnPageSelected,
  areAllRowsSelected,
}) => {
  const [isSelectAllChecked, setSelectAllChecked] = useState(null);
  const [isSelectAllDropdownOpen, setSelectAllDropdownOpen] = useState(false);

  // Checkbox states: false = unchecked, null = partially-checked, true = checked
  // Flow: All are selected -> click -> none are selected
  // Some are selected -> click -> none are selected
  // None are selected -> click -> page is selected
  const onSelectAllCheckboxChange = () => {
    if (isSelectAllChecked === false) {
      return selectPage();
    }
    return selectNone();
  };
  const onSelectAllDropdownToggle = () => setSelectAllDropdownOpen(isOpen => !isOpen);

  // TODO: uncomment when Select All is implemented in Katello API
  // const handleSelectAll = () => {
  //   setSelectAllDropdownOpen(false);
  //   selectAll();
  // };
  const handleSelectPage = () => {
    setSelectAllDropdownOpen(false);
    selectPage();
  };
  const handleSelectNone = () => {
    setSelectAllDropdownOpen(false);
    selectNone();
  };

  useEffect(() => {
    let newCheckedState;
    if (selectedCount === 0) {
      newCheckedState = false;
    } else if (selectedCount > 0) {
      newCheckedState = null; // null is partially-checked state
    } else if (areAllRowsSelected) {
      newCheckedState = true;
    }
    setSelectAllChecked(newCheckedState);
  }, [selectedCount, areAllRowsSelected]);

  // TODO: add the following to selectAllDropdownItems when Select All is implemented
  // <DropdownItem key="select-all" component="button" isDisabled onClick={handleSelectAll}>
  //   {`${__('Select all')} (${totalCount})`}
  // </DropdownItem>,

  const selectAllDropdownItems = [
    <DropdownItem key="select-none" component="button" onClick={handleSelectNone}>
      {`${__('Select none')} (0)`}
    </DropdownItem>,
    <DropdownItem key="select-page" component="button" isDisabled={areAllRowsOnPageSelected} onClick={handleSelectPage}>
      {`${__('Select page')} (${pageRowCount})`}
    </DropdownItem>,
  ];

  return (
    <Dropdown
      toggle={
        <DropdownToggle
          onToggle={onSelectAllDropdownToggle}
          id="toggle-id-8"
          splitButtonItems={[
            <DropdownToggleCheckbox
              className="tablewrapper-select-all-checkbox"
              key="tablewrapper-select-all-checkbox"
              aria-label="Select all"
              onChange={checked => onSelectAllCheckboxChange(checked)}
              isChecked={isSelectAllChecked}
            >
              {selectedCount > 0 && `${selectedCount} selected`}
            </DropdownToggleCheckbox>,
          ]}
        />
    }
      isOpen={isSelectAllDropdownOpen}
      dropdownItems={selectAllDropdownItems}
    />
  );
};

// TODO: uncomment selectAll and totalCount when Select All is implemented
SelectAllCheckbox.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  // selectAll: PropTypes.func.isRequired,
  selectNone: PropTypes.func.isRequired,
  selectPage: PropTypes.func.isRequired,
  pageRowCount: PropTypes.number.isRequired,
  // totalCount: PropTypes.number.isRequired,
  areAllRowsSelected: PropTypes.bool.isRequired,
  areAllRowsOnPageSelected: PropTypes.bool.isRequired,
};

export default SelectAllCheckbox;
