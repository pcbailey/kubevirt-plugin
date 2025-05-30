import React from 'react';
import { Trans } from 'react-i18next';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { Alert, AlertVariant } from '@patternfly/react-core';

import { uploadErrorType } from '../utils/consts';

type UploadErrorMessageProps = {
  message: string;
  uploadProxyURL?: string;
};

const UploadPVCErrorMessage: React.FC<UploadErrorMessageProps> = ({ message, uploadProxyURL }) => {
  const { t } = useKubevirtTranslation();

  const Error = {
    [uploadErrorType.ALLOCATE]: t('Could not create persistent volume claim'),
    [uploadErrorType.CERT]: (
      <>
        {t('It seems that your browser does not trust the certificate of the upload proxy.')}
        {uploadProxyURL && (
          <Trans ns="plugin__kubevirt-plugin" t={t}>
            Please{' '}
            <a href={`https://${uploadProxyURL}`} rel="noopener noreferrer" target="_blank">
              approve this certificate
            </a>{' '}
            and try again
          </Trans>
        )}
      </>
    ),
    [uploadErrorType.MISSING]: t('File input is missing'),
  };
  return (
    <Alert
      className="co-alert--scrollable"
      isInline
      title={t('An error occurred')}
      variant={AlertVariant.danger}
    >
      <div className="co-pre-line">{Error?.[message] || message}</div>
    </Alert>
  );
};

export default UploadPVCErrorMessage;
