import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { urlBuilder } from 'foremanReact/common/urlHelpers';

const ContentViewVersionContent = ({ cvId, versionId, cvVersion }) => {
  const {
    deb_count: debCount,
    docker_manifest_count: dockerManifestCount,
    docker_tag_count: dockerTagCount,
    file_count: fileCount,
    module_stream_count: moduleStreamCount,
  } = cvVersion;

  return (
    <React.Fragment>
      {(moduleStreamCount > 0 &&
        <>
          <Link to={`/versions/${versionId}/moduleStreams`}>
            {`${moduleStreamCount} Module Streams`}
          </Link><br />
        </>)
      }
      {(debCount > 0 &&
        <>
          <Link to={`/versions/${versionId}/debPackages`}>
            {`${debCount} Deb Packages`}
          </Link><br />
        </>)
      }
      {(dockerManifestCount > 0 && dockerTagCount > 0 &&
        <>
          <Link to={`/versions/${versionId}/dockerTags`}>
            {`${dockerTagCount} Docker tags`}
          </Link><br />
          <a href={urlBuilder(`content_views/${cvId}/versions/${versionId}/docker`, '')}>{`${dockerManifestCount} Container manifests`}</a><br />
        </>)
      }
      {fileCount > 0 &&
        <>
          <a href={urlBuilder(`content_views/${cvId}/versions/${versionId}/file`, '')}>{`${fileCount} Files`}</a><br />
        </>
      }
      {(moduleStreamCount === 0 && debCount === 0 &&
        dockerManifestCount === 0 && dockerTagCount === 0 &&
        fileCount === 0 &&
        <TextContent>
          <Text component={TextVariants.small}>{__('N/A')}</Text>
        </TextContent>
      )
      }
    </React.Fragment>
  );
};

ContentViewVersionContent.propTypes = {
  cvId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  versionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cvVersion: PropTypes.shape({
    deb_count: PropTypes.number,
    docker_manifest_count: PropTypes.number,
    docker_tag_count: PropTypes.number,
    file_count: PropTypes.number,
    module_stream_count: PropTypes.number,
  }),
};

ContentViewVersionContent.defaultProps = {
  cvId: '',
  versionId: '',
  cvVersion: {
    deb_count: 0,
    docker_manifest_count: 0,
    docker_tag_count: 0,
    file_count: 0,
    module_stream_count: 0,
  },
};

export default ContentViewVersionContent;
