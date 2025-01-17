import React, { useState, useCallback, useContext } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { translate as __ } from 'foremanReact/common/I18n';
import { urlBuilder } from 'foremanReact/common/urlHelpers';
import { TableVariant, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import TableWrapper from '../../../../../components/Table/TableWrapper';
import { selectCVHosts, selectCVHostsStatus } from '../../ContentViewDetailSelectors';
import EnvironmentLabels from '../../../components/EnvironmentLabels';
import { getHosts } from '../../ContentViewDetailActions';
import DeleteContext from './DeleteContext';

const AffectedHosts = () => {
  const { versionEnvironments, selectedEnvSet, cvId } = useContext(DeleteContext);
  const [searchQuery, updateSearchQuery] = useState('');
  const response = useSelector(state => selectCVHosts(state), shallowEqual);
  const status = useSelector(state => selectCVHostsStatus(state), shallowEqual);
  const selectedEnv = versionEnvironments.filter(env => selectedEnvSet.has(env.id));


  const fetchItems = useCallback(() => {
    let cvQuery = `content_view_id=${cvId}`;
    const selectedEnvStrings = selectedEnv.map(env => `lifecycle_environment_id=${env.id}`).join(' OR ');
    if (selectedEnvStrings.length) {
      cvQuery += ' AND (';
      cvQuery += `${selectedEnvStrings} )`;
    }
    if (searchQuery.length) {
      cvQuery += ' AND (';
      cvQuery += `${searchQuery} )`;
    }

    return getHosts({ search: cvQuery });
  }, [cvId, searchQuery, selectedEnv]);
  const columnHeaders = [
    __('Name'),
    __('Environment'),
  ];
  const emptyContentTitle = __('No matching hosts found.');
  const emptyContentBody = __("Given criteria doesn't match any hosts. Try changing your rule.");
  const emptySearchTitle = __('Your search returned no matching hosts.');
  const emptySearchBody = __('Try changing your search criteria.');
  const { results, ...metadata } = response;
  return (
    <TableWrapper
      {...{
        metadata,
        emptyContentTitle,
        emptyContentBody,
        emptySearchTitle,
        emptySearchBody,
        searchQuery,
        updateSearchQuery,
        fetchItems,
        status,
      }}
      autocompleteEndpoint="/hosts/auto_complete_search"
      foremanApiAutoComplete
      variant={TableVariant.compact}
    >
      <Thead>
        <Tr>
          {columnHeaders.map(col =>
            <Th key={col}>{col}</Th>)}
        </Tr>
      </Thead>
      <Tbody>
        {results?.map(({
          name,
          id,
          content_facet_attributes: { lifecycle_environment: environment },
        }) => (
          <Tr key={`${id}`}>
            <Td>
              <a rel="noreferrer" target="_blank" href={urlBuilder(`hosts/${id}`, '')}>{name}</a>
            </Td>
            <Td><EnvironmentLabels environments={environment} /></Td>
          </Tr>
        ))
      }
      </Tbody>
    </TableWrapper>
  );
};

export default AffectedHosts;
