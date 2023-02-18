import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import {Box, Button, Typography} from '@mui/material';
import { useCopyToClipboard } from 'react-use';
import { saveAs } from 'file-saver';
import { useEffect } from 'react';
import DeleteSecret from "./DeleteSecret";

const RenderSecret = ({ secret, deleteUri }: { readonly secret: string, readonly deleteUri?: string }) => {
  const { t } = useTranslation();
  const [copy, copyToClipboard] = useCopyToClipboard();

  return (
    <div>
      <Typography textAlign="center" marginBottom="2rem"  variant="h4">{t('secret.titleMessage')}</Typography>
      <Typography textAlign="center" marginBottom="2rem" >{t('secret.subtitleMessage')}</Typography>
      <Typography
        id="pre"
        data-test-id="preformatted-text-secret"
        sx={{
          backgroundColor: '#ecf0f1',
          padding: '15px',
          border: '1px solid #cccccc',
          display: 'block',
          fontSize: '1rem',
          borderRadius: '4px',
          wordWrap: 'break-word',
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace, monospace', // https://github.com/necolas/normalize.css/issues/519#issuecomment-197131966
        }}
      >
        {secret}
      </Typography>
        <Box display="flex" gap={2} justifyContent="center" marginTop="2rem">
            <Button
                color={copy.error ? 'secondary' : 'primary'}
                variant="contained"
                onClick={() => copyToClipboard(secret)}
            >
                <FontAwesomeIcon icon={faCopy} /> &nbsp; {t('secret.buttonCopy')}
            </Button>
            { deleteUri && <DeleteSecret url={deleteUri} /> }
        </Box>
    </div>
  );
};

const DownloadSecret = ({
  secret,
  fileName,
}: {
  readonly secret: string;
  readonly fileName: string;
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    saveAs(
      new Blob([secret], {
        type: 'application/octet-stream',
      }),
      fileName,
    );
  }, [fileName, secret]);

  return (
    <div>
      <Typography variant="h4">{t('secret.titleFile')}</Typography>
    </div>
  );
};

const Secret = ({
    secret,
    deleteUri,
    fileName,
}: {
    readonly secret: string;
    readonly deleteUri?: string;
    readonly fileName?: string;
}) => {
  if (fileName) {
    return <DownloadSecret fileName={fileName} secret={secret} />;
  }

  return <RenderSecret secret={secret} deleteUri={deleteUri} />;
};

export default Secret;
