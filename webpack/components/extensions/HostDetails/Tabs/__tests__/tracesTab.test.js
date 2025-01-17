import React from 'react';
import { renderWithRedux, waitFor, patientlyWaitFor } from 'react-testing-lib-wrapper';
import nock, { nockInstance, assertNockRequest, mockForemanAutocomplete, mockSetting } from '../../../../../test-utils/nockWrapper';
import { foremanApi } from '../../../../../services/api';
import { HOST_TRACES_KEY } from '../HostTracesConstants';
import TracesTab from '../TracesTab';

const mockTraceData = require('./traces.fixtures.json');
const mockResolveTraceTask = require('./resolveTraces.fixtures.json');

const renderOptions = {
  apiNamespace: HOST_TRACES_KEY,
  initialState: {
    API: {
      HOST_DETAILS: {
        response: {
          id: 1,
        },
        status: 'RESOLVED',
      },
    },
  },
};

const hostTraces = foremanApi.getApiUrl('/hosts/1/traces?per_page=20&page=1');
const resolveHostTraces = foremanApi.getApiUrl('/hosts/1/traces/resolve');
const autocompleteUrl = '/hosts/1/traces/auto_complete_search';

let firstTraces;
let searchDelayScope;
let autoSearchScope;

beforeEach(() => {
  const { results } = mockTraceData;
  [firstTraces] = results;
  searchDelayScope = mockSetting(nockInstance, 'autosearch_delay', 500);
  autoSearchScope = mockSetting(nockInstance, 'autosearch_while_typing', true);
});

afterEach(() => {
  nock.cleanAll();
  assertNockRequest(searchDelayScope);
  assertNockRequest(autoSearchScope);
});

test('Can call API for traces and show on screen on page load', async (done) => {
  // Setup autocomplete with mockForemanAutoComplete since we aren't adding /katello
  const autocompleteScope = mockForemanAutocomplete(nockInstance, autocompleteUrl);

  // return tracedata results when we look for traces
  const scope = nockInstance
    .get(hostTraces)
    .reply(200, mockTraceData);

  const { queryByText } = renderWithRedux(<TracesTab />, renderOptions);

  // Assert that the traces are now showing on the screen, but wait for them to appear.
  await patientlyWaitFor(() => expect(queryByText(firstTraces.application)).toBeInTheDocument());
  // Assert request was made and completed, see helper function
  assertNockRequest(autocompleteScope);
  assertNockRequest(scope, done); // Pass jest callback to confirm test is done
});

test('Can handle no traces being present', async (done) => {
  // Setup autocomplete with mockForemanAutoComplete since we aren't adding /katello
  const autocompleteScope = mockForemanAutocomplete(nockInstance, autocompleteUrl);

  const noResults = {
    total: 0,
    subtotal: 0,
    page: 1,
    per_page: 20,
    results: [],
  };

  const scope = nockInstance
    .get(hostTraces)
    .reply(200, noResults);

  const { queryByText } = renderWithRedux(<TracesTab />, renderOptions);

  // Assert that there are not any traces showing on the screen.
  await patientlyWaitFor(() => expect(queryByText('This host currently does not have traces.')).toBeInTheDocument());
  // Assert request was made and completed, see helper function
  assertNockRequest(autocompleteScope);
  assertNockRequest(scope, done); // Pass jest callback to confirm test is done
});

test('Can restart traces', async (done) => {
  // Setup autocomplete with mockForemanAutoComplete since we aren't adding /katello
  const autocompleteScope = mockForemanAutocomplete(nockInstance, autocompleteUrl);

  const scope = nockInstance
    .get(hostTraces)
    .times(2)
    .reply(200, mockTraceData);
  const resolveTracesScope = nockInstance
    .put(resolveHostTraces)
    .reply(202, mockResolveTraceTask);

  const { getByText } = renderWithRedux(
    <TracesTab />,
    renderOptions,
  );
  let traceCheckbox;
  // Find the trace.
  await patientlyWaitFor(() => {
    const traceNameNode = getByText(firstTraces.application);
    traceCheckbox = traceNameNode.previousElementSibling.firstElementChild;
  });
  // Find the checkbox to the left of the trace.
  // (We could also have just found the checkbox by its aria-label "Select row 0",
  // but this is closer to how the user would do it)
  traceCheckbox.click();
  expect(traceCheckbox.checked).toEqual(true);

  const restartAppButton = getByText('Restart app');
  // wait 50ms so that the button is enabled
  await waitFor(() => {
    expect(getByText('Restart app')).not.toBeDisabled();
    restartAppButton.click();
  });

  assertNockRequest(autocompleteScope);
  assertNockRequest(resolveTracesScope);
  assertNockRequest(scope, done); // Pass jest callback to confirm test is done
});
