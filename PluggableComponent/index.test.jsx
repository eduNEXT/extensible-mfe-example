import React, { useState } from 'react';
import {
  render, waitFor, screen, fireEvent,
} from '@testing-library/react';
import PluggableComponent from '.';

const ToggleContentComponent = () => {
  const [showContent, setShowContent] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setShowContent((prev) => !prev)}>
        Toggle Content
      </button>
      {showContent && <div data-testid="toggle-content">Toggle On</div>}
    </div>
  );
};

describe('PluggableComponent', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('renders correctly', async () => {
    const handleClickMock = jest.fn();
    const props = {
      title: 'button title',
      handleClick: handleClickMock,
    };

    const { container } = render(
      <PluggableComponent
        id="example-plugin"
        as="example-app-example-plugin"
      >
        <h1>Hi this is the original component</h1>
      </PluggableComponent>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('plugin-example')?.textContent).toContain('@openedx-plugins/example-app-example-plugin');
    });
  });

  test('loads children component when import is invalid', async () => {
    render(
      <PluggableComponent id="est-pluggable" as="invalid import">
        <div data-testid="plugin">Plugin Loaded</div>
      </PluggableComponent>,
    );

    await waitFor(() => {
      const defaultComponent = screen.getByTestId('plugin');
      expect(screen.getByText('Plugin Loaded')).toBeInTheDocument();
      expect(defaultComponent).toBeInTheDocument();
    });
  });

  test('loads children component when import is empty', async () => {
    render(
      <PluggableComponent
        id="test-pluggable"
        as=""
      >
        <div data-testid="plugin">Plugin Loaded</div>
      </PluggableComponent>,
    );

    await waitFor(() => {
      const defaultComponent = screen.getByTestId('plugin');
      expect(screen.getByText('Plugin Loaded')).toBeInTheDocument();
      expect(defaultComponent).toBeInTheDocument();
    });
  });

  test('returns null when do not have children and import is invalid', async () => {
    render(
      <PluggableComponent
        id="test-pluggable"
        as="invalid-module"
      />,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('plugin')).not.toBeInTheDocument();
    });
  });


  test('updates component when children change', async () => {
    const { getByText, getByTestId } = render(
      <PluggableComponent
        id="test-pluggable"
        as="default-children"
      >
        <ToggleContentComponent />
      </PluggableComponent>,
    );

    await waitFor(() => {
      const toggleContent = screen.queryByTestId('toggle-content');
      expect(toggleContent).not.toBeInTheDocument();
    });

    const toggleButton = getByText('Toggle Content');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const toggleContent = getByTestId('toggle-content');
      expect(toggleContent).toBeInTheDocument();
      expect(toggleContent).toHaveTextContent('Toggle On');
    });
  });

  test('renders loadingComponent while the plugin is loading', async () => {
    jest.mock('./utils', () => ({
      isPluginAvailable: jest.fn().mockImplementation(
        () => new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        }),
      ),
    }));

    await waitFor(() => {
      const { getByText } = render(
        <PluggableComponent
          id="test-pluggable"
          as="communications-app-test-component"
          title="Test Pluggable"
          loadingComponent={<div>Loading...</div>}
        />,
      );
      expect(getByText('Loading...')).toBeInTheDocument();
    });
  });
});
