import React from 'react';
import {
  CadenceProblem,
  goTo,
  hideDecorations,
  Highlight,
  hover,
} from 'util/language-syntax-errors';
import { ErrorMessage } from '../CadenceEditor/ControlPanel/Arguments/styles';
import { renderMessage } from '../CadenceEditor/ControlPanel/Arguments/components';
import { Flex } from 'theme-ui';
import { SXStyles } from 'src/types';
import { useProject } from 'providers/Project/projectHooks';
import { IPosition } from 'monaco-editor';

const styles: SXStyles = {
  root: {
    flex: 1,
    gap: 3,
    flexDirection: 'column',
    counterReset: 'lines',
    minHeight: '40px',
    padding: 6,
    background: 'background',
    borderRadius: '8px',
    overflowY: 'auto',
    height: '100%',
  },
  list: {
    flexDirection: 'column',
    width: '100%',
  },
  errorLine: {
    cursor: 'pointer',
    alignItems: 'baseline',
    boxSizing: 'border-box',
    padding: '10px',
    fontSize: '14px',
    background: '#ffffff',
    margin: '4px 0px',
    boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.08)',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'rgba(244, 57, 64, 0.15)',
    },
  },
  index: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
};

const RenderError = (props: any) => {
  const { currentEditor } = useProject();
  const list = props.list.error ?? [];

  const actions = {
    goTo: (position: IPosition) => goTo(currentEditor, position),
    hideDecorations: () => hideDecorations(currentEditor),
    hover: (highlight: Highlight) => hover(currentEditor, highlight),
  };

  return (
    <Flex sx={styles.root}>
      <Flex sx={styles.list}>
        {list.length > 0
          ? [...list].reverse().map((item: CadenceProblem, i: number) => {
              const message = renderMessage(item.message);
              return (
                <Flex
                  onClick={() => actions.goTo(item.position)}
                  onMouseOver={() => actions.hover(item.highlight)}
                  onMouseOut={() => actions.hideDecorations()}
                  sx={styles.errorLine}
                  key={i}
                >
                  <Flex sx={styles.index}>
                    <span>Line: {item.position.lineNumber}</span>
                  </Flex>
                  <ErrorMessage>{message}</ErrorMessage>
                </Flex>
              );
            })
          : 'Nice! No Syntax Errors Found.'}
      </Flex>
    </Flex>
  );
};

export default RenderError;
