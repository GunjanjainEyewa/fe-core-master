
import { ApiHelper } from '@nykaa/utils/network';
import { logger } from '@nykaa/logger';
import { getUrl, ROUTES } from '@nykaa/utils/network/urls';
import widgetTransformer from '@nykaa/deals-transformer';
import { queryStringFromParams } from '@nykaa/utils/urls';
import logErrors from '@nykaa/logger/logErrors';
import { getDealsUrl } from '@nykaa/utils/network/urls';
import { transformConfigFlags } from './transformer';
import { CUSTOM_ERROR_MESSAGE, CUSTOM_WIDGET_API_ERROR } from './constants';


export const getConfigFlags = async () => {
  const url = getUrl(ROUTES.CONFIG_FLAGS);
  try {
    const { data } = await ApiHelper(url, 'get');

    const transformedConfigFlags = transformConfigFlags(data);
    return transformedConfigFlags;
  } catch (error) {
    // ! FIXME: use the new logging solution
    logger.error(error, 'Error fetching config flags');
    return null;
  }
};

export const getWidgets = async (queryParams: any) => {
  const url = getDealsUrl();
  const queryString = queryStringFromParams(queryParams);
  try {
    const { data: { result } } = await ApiHelper(`${url}${queryString}`, 'get');
    if (!result) {
      throw new Error(CUSTOM_WIDGET_API_ERROR);
    }
    const transformedData = widgetTransformer(
      result,
      true,
    );
    return transformedData.widgets;
  } catch (e) {
    logErrors(e, `${CUSTOM_ERROR_MESSAGE} :url=${url}`);
    throw e;
  }
};
