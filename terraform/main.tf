terraform {
  required_version = ">= 1.5.0"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_network" "weatherops_tf_net" {
  name = "weatherops-tf-net"
}

resource "docker_image" "prometheus" {
  name         = "prom/prometheus:v2.50.0"
  keep_locally = true
}

resource "docker_image" "grafana" {
  name         = "grafana/grafana:10.3.1"
  keep_locally = true
}

resource "docker_container" "weatherops_web" {
  name    = "weatherops-tf-web"
  image   = "weatherops-frontend:v1.0.0"
  restart = "unless-stopped"

  ports {
    internal = 80
    external = 8082
  }

  networks_advanced {
    name = docker_network.weatherops_tf_net.name
  }
}

resource "docker_container" "prometheus" {
  name    = "weatherops-tf-prometheus"
  image   = docker_image.prometheus.image_id
  restart = "unless-stopped"

  ports {
    internal = 9090
    external = 9091
  }

  networks_advanced {
    name = docker_network.weatherops_tf_net.name
  }
}

resource "docker_container" "grafana" {
  name    = "weatherops-tf-grafana"
  image   = docker_image.grafana.image_id
  restart = "unless-stopped"

  env = [
    "GF_SECURITY_ADMIN_USER=admin",
    "GF_SECURITY_ADMIN_PASSWORD=weatherops_demo"
  ]

  ports {
    internal = 3000
    external = 3002
  }

  networks_advanced {
    name = docker_network.weatherops_tf_net.name
  }

  depends_on = [docker_container.prometheus]
}

output "weatherops_url" {
  value = "http://localhost:8082"
}

output "prometheus_url" {
  value = "http://localhost:9091"
}

output "grafana_url" {
  value = "http://localhost:3002"
}
