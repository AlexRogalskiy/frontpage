import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { ButtonToggle, styles } from '@storybook/design-system';
import useSiteMetadata from '../../lib/useSiteMetadata';
import { SocialGraph } from '../../basics';
import { AddonsGrid } from '../../layout/addons/AddonsGrid';
import { AddonsLayout } from '../../layout/addons/AddonsLayout';

const { color, typography, breakpoint } = styles;

const Heading = styled.h2`
  font-size: ${typography.size.m3}px;
  line-height: ${typography.size.l2}px;
  font-weight: ${typography.weight.black};
  letter-spacing: -0.29px;
  margin-bottom: 4px;
  color: ${color.darkest};

  @media (min-width: ${breakpoint * 1}px) {
    font-size: 36px;
    margin-bottom: 8px;
    letter-spacing: -0.37px;
  }
`;

const Subheading = styled.div`
  font-size: ${typography.size.s3}px;
  line-height: ${typography.size.m2}px;
  letter-spacing: -0.33px;
  margin-bottom: 24px;
  color: ${color.darker};

  @media (min-width: ${breakpoint * 1}px) {
    font-size: ${typography.size.m1}px;
    line-height: ${typography.size.l1}px;
    letter-spacing: -0.42px;
  }
`;

const PopularAddons = styled(AddonsGrid)`
  margin-bottom: 48px;
`;

export const AddonsHomeScreen = ({ popularAddons, trendingAddons }) => {
  const { title, ogImageAddons, urls = {} } = useSiteMetadata();
  const { home } = urls;
  const [timePeriod, setTimePeriod] = useState('MONTH');
  const popularAddonsForTimePeriod = useMemo(() => popularAddons[timePeriod], [
    popularAddons,
    timePeriod,
  ]);

  return (
    <>
      <SocialGraph
        title={`Addons | ${title}`}
        desc="Addons enable advanced functionality and unlock new workflows. Contributed by core maintainers and the amazing developer community."
        url={`${home}/addons`}
        image={ogImageAddons}
      />
      <AddonsLayout currentPath="/addons/">
        <Heading>Supercharge Storybook</Heading>
        <Subheading>Addons unlock advanced features and new workflows for Storybook</Subheading>
        <PopularAddons
          title="Popular"
          addonItems={popularAddonsForTimePeriod}
          actions={
            <ButtonToggle
              selectedIndex={timePeriod === 'MONTH' ? 0 : 1}
              onSelectIndex={() => {
                setTimePeriod(timePeriod === 'MONTH' ? 'YEAR' : 'MONTH');
              }}
              titles={[
                { title: 'Month', tooltip: 'Month' },
                { title: 'Year', tooltip: 'Year' },
              ]}
            />
          }
        />
        <AddonsGrid title="Trending" addonItems={trendingAddons} />
      </AddonsLayout>
    </>
  );
};

AddonsHomeScreen.propTypes = {
  popularAddons: PropTypes.shape({
    MONTH: AddonsGrid.propTypes.addonItems,
    YEAR: AddonsGrid.propTypes.addonItems,
  }).isRequired,
  trendingAddons: AddonsGrid.propTypes.addonItems.isRequired,
};
