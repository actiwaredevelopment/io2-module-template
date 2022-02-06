import fs from 'fs';
import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';

export function uploadModule(moduleFile: string, projectService: string, uploadToken: string) {
    if (fs.existsSync(moduleFile) === false) {
        console.error(`[${Date.now().toString()}]: The module definition file: ${moduleFile} not exists. For this reason, no module can be uploaded to the project service.`);
        return;
    }

    if (projectService?.length === 0) {
        console.error(`[${Date.now().toString()}]: Project service is not defined in the environment (PROJECT_SERVICE). For this reason, no module can be uploaded to the project service.`);
        return;
    }

    if (uploadToken?.length === 0) {
        console.error(`[${Date.now().toString()}]: An upload token is not defined in the environment (TOKEN). For this reason, no module can be uploaded to the project service.`);
        return;
    }

    console.log(`[${Date.now().toString()}]: Try to upload the module definition file: ${moduleFile} to the project service: ${projectService}`);

    try {
        const data = new FormData();
        data.append('file', fs.createReadStream(moduleFile));

        const config: AxiosRequestConfig = {
            method: 'put',
            url: `${projectService}/api/v1/module`,
            headers: {
                'Authorization': `Bearer ${uploadToken}`,
                ...data.getHeaders()
            },
            data: data
        };

        axios(config)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`[${Date.now().toString()}]: Upload was successfully`);
                } else {
                    console.error(`[${Date.now().toString()}]: The service has returned the following status code: {response.StatusCode.ToString()}`);
                    console.log(`[${Date.now().toString()}]: ${JSON.stringify(response.data)}`);
                    console.warn(`[${Date.now().toString()}]: The module could not be provided, please upload the module manually. You can also download the current module via the route /api/v2/info/module/download.`);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    }
}