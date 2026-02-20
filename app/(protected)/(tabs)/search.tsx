import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState } from 'react';

import { CarCard } from '@/components/CarCard';
import FiltersBottomSheet from '@/components/ui/FiltersBottomSheet';
import { FlashList } from '@shopify/flash-list';
import { SearchPageHeader } from '@/components/ui/SearchPageHeader';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useVehicles, type VehicleFilters } from '@/services/supabase.api';
import { MAKES, PRICE_RANGES, YEARS, TRANSMISSIONS } from '@/constants/filters';
import { MOCK_VEHICLES } from '@/constants/mock-data';
import type { Filters } from '@/types/filters';

const StyledContainer = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
}));

const StyledScrollView = styled.ScrollView({
  flex: 1,
});

const ScrollContent = styled.View({
  padding: 16,
  flexGrow: 1,
});

const NoResults = styled.Text(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.textSecondary,
  marginTop: 20,
  fontSize: 16,
}));


function filtersToQuery(f: Filters): VehicleFilters {
  const q: VehicleFilters = {};
  if (f.make) q.make = f.make;
  if (f.priceRange) { q.minPrice = f.priceRange.min; q.maxPrice = f.priceRange.max; }
  if (f.year) { q.minYear = f.year; q.maxYear = f.year; }
  if (f.transmission) q.transmission = f.transmission;
  return q;
}

const SearchScreen = () => {
  const theme = useTheme();
  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [filters, setFilters] = useState<Filters>({});

  const queryFilters = useMemo(() => filtersToQuery(activeFilters), [activeFilters]);
  const { data: vehiclesData, isLoading, refetch } = useVehicles(queryFilters);
  const vehicles = vehiclesData?.length ? vehiclesData : MOCK_VEHICLES;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseFilters = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  // Filter handlers
  const handleMakeSelect = (make: string) => {
    setFilters(prev => ({ ...prev, make: prev.make === make ? undefined : make }));
  };

  const handlePriceSelect = (range: typeof PRICE_RANGES[0]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange?.label === range.label ? undefined : range
    }));
  };

  const handleYearSelect = (year: number) => {
    setFilters(prev => ({ ...prev, year: prev.year === year ? undefined : year }));
  };

  const handleTransmissionSelect = (transmission: string) => {
    setFilters(prev => ({
      ...prev,
      transmission: prev.transmission === transmission ? undefined : transmission
    }));
  };

  const handleApply = () => {
    setActiveFilters(filters);
    handleCloseFilters();
  };

  const handleClearAll = () => {
    setFilters({});
    setActiveFilters({});
  };

  const handleRemoveFilter = (key: keyof Filters) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
    setFilters(newFilters);
  };

  const filterSections = useMemo(() => [
    {
      title: 'Make',
      options: MAKES.map(make => ({ label: make, value: make })),
      selectedValue: filters.make,
      onSelect: (value: string | number) => handleMakeSelect(value as string),
    },
    {
      title: 'Price Range',
      options: PRICE_RANGES.map(range => ({ label: range.label, value: range.label })),
      selectedValue: filters.priceRange?.label,
      onSelect: (value: string | number) => {
        const range = PRICE_RANGES.find(r => r.label === value);
        if (range) handlePriceSelect(range);
      },
    },
    {
      title: 'Year',
      options: YEARS.slice(0, 10).map(year => ({ label: String(year), value: year })),
      selectedValue: filters.year,
      onSelect: (value: string | number) => handleYearSelect(value as number),
    },
    {
      title: 'Transmission',
      options: TRANSMISSIONS.map(trans => ({ label: trans, value: trans })),
      selectedValue: filters.transmission,
      onSelect: (value: string | number) => handleTransmissionSelect(value as string),
    },
  ], [filters]);

  const emptyText = 'No cars match your filters. Try adjusting your search criteria.';

  // renders
  const renderBackdrop = useCallback(
    (props_: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props_}
        pressBehavior="close"
        opacity={0.5}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, []);

  return (
    <StyledContainer>
      <StyledScrollView
        contentContainerStyle={{ minHeight: '100%' }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}>
        <ScrollContent>
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <FlashList
              data={vehicles}
              renderItem={({ item }) => <CarCard key={item.id} {...item} />}
              estimatedItemSize={200}
              refreshing={isLoading}
              onRefresh={handleRefresh}
              ListEmptyComponent={<NoResults>{emptyText}</NoResults>}
              ListHeaderComponent={
                <SearchPageHeader
                  activeFilters={activeFilters}
                  onOpenFilters={handlePresentModalPress}
                  onRemoveFilter={handleRemoveFilter}
                />
              }
            />
          )}
        </ScrollContent>
      </StyledScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["80%"]}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textSecondary }}
      >
        <FiltersBottomSheet
          sections={filterSections}
          onApply={() => {
            handleApply();
            handleCloseFilters();
          }}
          onClose={handleCloseFilters}
          onClear={handleClearAll}
        />
      </BottomSheetModal>
    </StyledContainer>
  );
}

export default SearchScreen;