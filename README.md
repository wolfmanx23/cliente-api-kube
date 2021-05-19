Prerrequisitos para ejecutar los siguientes comandos
Conocimientos Previos
	Administración de kubernetes
	Desarrollo web
	Continuos Integration
	Continuos Delivery
Terminal de Linux
	IBM Cloud CLI instalado
	OC instalado
	TKN instalado
	Kubectl instalado
Cuenta en IBM Cloud
	Cuenta con créditos para desplegar un clúster de openshift
Clúster de Openshift en IBM Cloud
	2 worker nodes de 4x16 en cualquier región de IBM Cloud
Código de un proyecto a desplegar
	Listo para desplegar
	YAML: Deployment, Service, Route



#NOTAS: Durante el despliegue, el nombre del despliegue debe ser identico al del repositorio de github
#ingresa al clúster vía CLI con el token del clúster
#ANTES DE CONTINUAR INSTALA EL PIPELINE CONNECTOR
oc create -f https://raw.githubusercontent.com/wolfmanx23/cliente-api-kube/master/pipeline/sub.yaml
#instala el CLI de Tekton
#https://github.com/tektoncd/cli#installing-tkn

#creación del proyecto
oc new-project pipelines-tutorial
#verificación de permisos
oc get serviceaccount pipeline


#despliega los siguientes yaml para indicar la ubicación de los yaml de despliegue y la secuencia de despliegue
oc create -f https://raw.githubusercontent.com/wolfmanx23/cliente-api-kube/master/pipeline/tareas_despliegue.yaml
oc create -f https://raw.githubusercontent.com/wolfmanx23/cliente-api-kube/master/pipeline/actualizacion_despliegue.yaml
#creacion del pipeline
oc create -f https://raw.githubusercontent.com/wolfmanx23/cliente-api-kube/master/pipeline/pipeline.yaml

#listado de las tareas desplegadas
tkn task ls


#ejecucion manual del pipelines
tkn pipeline start build-and-deploy -w \
name=shared-workspace,volumeClaimTemplateFile=https://raw.githubusercontent.com/wolfmanx23/cliente-api-kube/master/pipeline/pv.yaml \
-p deployment-name=cliente-api-kube \
-p git-url=https://github.com/wolfmanx23/cliente-api-kube.git \
-p IMAGE=image-registry.openshift-image-registry.svc:5000/pipelines-tutorial/cliente-api-kube

#revision del progreso del pipelines
tkn pipeline list
#tkn pipelinerun ls
#tkn pipeline logs -f
#tomara algunos minutos para que se realice el tareas_despliegue

#ahora crearemos el template del trigger
oc create -f https://raw.githubusercontent.com/wolfmanx23/cliente-api-kube/master/pipeline/disparador-plantilla.yaml
#ahora crearemos el binding del TriggerTemplate
oc create -f https://raw.githubusercontent.com/wolfmanx23/cliente-api-kube/master/pipeline/disparador-binding.yaml
#creacion del trigger
oc create -f https://raw.githubusercontent.com/wolfmanx23/cliente-api-kube/master/pipeline/disparador.yaml
#ahora habilitaremos la recepcion de eventos de github
oc create -f https://raw.githubusercontent.com/wolfmanx23/cliente-api-kube/master/pipeline/eventlistener.yaml
#ahora habilitaremos una URL para la recepcion de eventos de githubusercontent
oc expose svc el-clienteapi-listener

#Limpieza del ambiente
oc delete deployment cliente-api-kube
oc delete service cliente-api-kube-service
oc delete route cliente-api-kube-route

oc delete pipeline build-and-deploy
oc delete task update-deployment
oc delete task apply-manifests
oc delete LimitRange limit-mem-cpu-per-container

oc delete TriggerTemplate cliente-api-kube-template
oc delete TriggerBinding cliente-api-kube-binding
oc delete Trigger disparador-cliente-api-kube
oc delete EventListener clienteapi-listener


oc delete Subscription openshift-pipelines-operator
