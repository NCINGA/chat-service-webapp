import {gql} from '@apollo/client';

export const FETCH_SEAT_MAP = gql`
    query FetchSeatMap($configName: String!, $eventId: String!, $zoneId: String!) {
        fetchSeatMap(configName: $configName, eventId: $eventId, zoneId: $zoneId)
    }
`;
