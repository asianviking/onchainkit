/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useName } from './useName';
import { publicClient } from '../../network/client';
import { getNewReactQueryTestProvider } from '../../test-utils/hooks/get-new-react-query-test-provider';

jest.mock('../../network/client');

describe('useName', () => {
  const mockGetEnsName = publicClient.getEnsName as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the correct ENS name and loading state', async () => {
    const testAddress = '0x123';
    const testEnsName = 'test.ens';

    // Mock the getEnsName method of the publicClient
    mockGetEnsName.mockResolvedValue(testEnsName);

    // Use the renderHook function to create a test harness for the useName hook
    const { result } = renderHook(() => useName({ address: testAddress }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    // Wait for the hook to finish fetching the ENS name
    await waitFor(() => {
      // Check that the ENS name and loading state are correct
      expect(result.current.data).toBe(testEnsName);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('returns the loading state true while still fetching from ens action', async () => {
    const testAddress = '0x123';

    // Use the renderHook function to create a test harness for the useName hook
    const { result } = renderHook(() => useName({ address: testAddress }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    // Wait for the hook to finish fetching the ENS name
    await waitFor(() => {
      // Check that the ENS name and loading state are correct
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('returns the correct sliced address when showAddress is true', async () => {
    const testAddress = '0x1234567890abcdef1234567890abcdef12345678';
    const testEnsName = 'test.ens';

    // Mock the getEnsName method of the publicClient
    mockGetEnsName.mockResolvedValue(testEnsName);

    // Use the renderHook function to create a test harness for the useName hook
    const { result } = renderHook(() => useName({ address: testAddress, showAddress: true }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    // Wait for the hook to finish fetching the ENS name
    await waitFor(() => {
      // Check that the ENS name and loading state are correct
      expect(result.current.data).toBe('0x123...5678');
      expect(result.current.isLoading).toBe(false);
    });
  });
});
