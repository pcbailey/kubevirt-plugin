import React, { FC } from 'react';

import HTTPSource from '@kubevirt-utils/components/AddBootableVolumeModal/components/VolumeSource/components/HTTPSource';
import FormGroupHelperText from '@kubevirt-utils/components/FormGroupHelperText/FormGroupHelperText';
import { DataUpload } from '@kubevirt-utils/hooks/useCDIUpload/useCDIUpload';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { FormGroup, TextInput } from '@patternfly/react-core';

import { AddBootableVolumeState, DROPDOWN_FORM_SELECTION } from '../../utils/constants';

import DiskSourceUploadPVC from './components/DiskSourceUploadPVC';
import PVCSource from './components/PVCSource';
import SnapshotSource from './components/SnapshotSource';

type VolumeSourceProps = {
  bootableVolume: AddBootableVolumeState;
  setBootableVolumeField: (
    key: keyof AddBootableVolumeState,
    fieldKey?: string,
  ) => (value: boolean | File | number | string) => void;
  sourceType: DROPDOWN_FORM_SELECTION;
  upload: DataUpload;
};

const VolumeSource: FC<VolumeSourceProps> = ({
  bootableVolume,
  setBootableVolumeField,
  sourceType,
  upload,
}) => {
  const { t } = useKubevirtTranslation();
  const { registryURL, uploadFile, uploadFilename } = bootableVolume || {};

  const sourceComponentByType = {
    [DROPDOWN_FORM_SELECTION.UPLOAD_VOLUME]: (
      <DiskSourceUploadPVC
        isIso={bootableVolume.isIso}
        label={t('Upload PVC image')}
        relevantUpload={upload}
        setIsIso={setBootableVolumeField('isIso')}
        setUploadFile={setBootableVolumeField('uploadFile')}
        setUploadFileName={setBootableVolumeField('uploadFilename')}
        uploadFile={uploadFile}
        uploadFileName={uploadFilename}
      />
    ),
    [DROPDOWN_FORM_SELECTION.USE_EXISTING_PVC]: (
      <PVCSource bootableVolume={bootableVolume} setBootableVolumeField={setBootableVolumeField} />
    ),
    [DROPDOWN_FORM_SELECTION.USE_HTTP]: (
      <HTTPSource setBootableVolumeField={setBootableVolumeField} />
    ),
    [DROPDOWN_FORM_SELECTION.USE_REGISTRY]: (
      <FormGroup fieldId="volume-registry-url" isRequired label={t('Registry URL')}>
        <TextInput
          data-test-id="volume-registry-url"
          id="volume-registry-url"
          onChange={(_, value: string) => setBootableVolumeField('registryURL')(value)}
          type="text"
          value={registryURL}
        />
        <FormGroupHelperText>
          {t('Example: quay.io/containerdisks/centos:7-2009')}
        </FormGroupHelperText>
      </FormGroup>
    ),
    [DROPDOWN_FORM_SELECTION.USE_SNAPSHOT]: (
      <SnapshotSource
        bootableVolume={bootableVolume}
        setBootableVolumeField={setBootableVolumeField}
      />
    ),
  };

  return sourceComponentByType[sourceType];
};

export default VolumeSource;
