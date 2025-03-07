/* eslint-env browser */
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import buildTagLinks from '../util/build-tag-links';

const initalValue = { search: [], relatedTags: [] };
const minQueryLength = 2;

export function useAddonsSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(initalValue);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(query, 100);

  // When the user starts typing, show the loading state
  useEffect(() => {
    if (query !== '' && isSearchLoading === false) {
      setIsSearchLoading(true);
    }

    if (query === '') {
      setIsSearching(false);
      setResults(initalValue);
    } else if (query !== '' && query.length > minQueryLength && isSearching === false) {
      setIsSearching(true);
    }
  }, [query]);

  // Fetch search results with a debounce
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > minQueryLength) {
      searchAddons(debouncedSearchTerm).then((resultsData) => {
        setIsSearchLoading(false);
        setResults(resultsData);
      });
    }
  }, [debouncedSearchTerm]);

  return {
    query,
    setQuery,
    isSearching,
    isSearchLoading,
    results,
  };
}

function searchAddons(query) {
  return fetch('https://boring-heisenberg-43a6ed.netlify.app/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
      query {
        partialSearch(query: "${query}") {
          id: name
          name
          displayName
          description
          icon
          authors {
            id: username
            avatarUrl: gravatarUrl
            name: username
          }
          weeklyDownloads
          repositoryUrl
          appearance: verified
          verifiedCreator
        }
        relatedTags(query: "${query}") {
          name
          displayName
          icon
        }
      }`,
    }),
  })
    .then((res) => res.json())
    .then((res) => ({
      search: res.data.partialSearch,
      relatedTags: buildTagLinks(res.data.relatedTags),
    }))
    .catch(() => {
      return initalValue;
    });
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeout = useRef();

  useLayoutEffect(() => {
    if (!timeout.current) {
      setDebouncedValue(value);
    }

    timeout.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout.current);
    };
  }, [value, delay]);

  return debouncedValue;
}
